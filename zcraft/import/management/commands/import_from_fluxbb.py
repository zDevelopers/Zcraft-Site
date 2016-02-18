# -*- coding=utf-8 -*-
import datetime
from optparse import make_option
from sys import stdout

import MySQLdb
import requests

from StringIO import StringIO
from django.contrib.auth.models import User, Group
from django.core.management.base import BaseCommand, CommandError
from zds.member.commons import BanSanction, TemporaryBanSanction
from zds.member.models import Profile, KarmaNote
from zds.settings import ZDS_APP


class Command(BaseCommand):
    help = 'Initialise les utilisateurs nécessaires et importe les données depuis une base FluxBB'
    args = '--host=<hôte de la base MySQL contenant les données à importer> --user=<utilisateur MySQL> ' \
           '--pw=<mot de passe> --base=<base>'

    option_list = BaseCommand.option_list + (
        make_option('--host',
                    action='store',
                    dest='mysql_host',
                    default=None,
                    help='Hôte de la base MySQL contenant les données à importer'),
        make_option('--user',
                    action='store',
                    dest='mysql_user',
                    default=None,
                    help='Utilisateur de la base MySQL contenant les données à importer'),
        make_option('--pw',
                    action='store',
                    dest='mysql_password',
                    default='',
                    help='Mot de passe de la base MySQL contenant les données à importer'),
        make_option('--base',
                    action='store',
                    dest='mysql_base',
                    default=None,
                    help='Nom de la base MySQL contenant les données à importer'),
    )

    def __init__(self):
        super(Command, self).__init__()

        self.connection = None

        self.bot_group = None
        self.god_group = None

        self.member_group = None
        self.animator_group = None
        self.staff_group = None
        self.admin_group = None

        self.encoding = 'ISO-8859-1'

    def handle(self, *args, **options):
        if not options['mysql_host'] or not options['mysql_user'] or not options['mysql_base']:
            self.stderr.write("No informations given to connect the imported MySQL database. "
                              "The script will only create the bot users.")
        else:
            try:
                self.connection = MySQLdb.connect(
                        host=options['mysql_host'],
                        user=options['mysql_user'],
                        passwd=options['mysql_password'],
                        db=options['mysql_base']
                )
            except MySQLdb.Error as e:
                raise CommandError("Unable to connect the database: " + str(e))

        self.create_groups()
        self.create_bot_users()

        if self.connection:
            self.import_users()
            self.import_forums()
            self.import_topics()

            self.connection.close()

    def create_groups(self):
        print("Creating user groups...")
        self.bot_group = self.create_group(ZDS_APP['member']['bot_group'])
        self.god_group = self.create_group(ZDS_APP['member']['god_group'])
        self.member_group = self.create_group(ZDS_APP['member']['member_group'])
        self.animator_group = self.create_group(ZDS_APP['member']['animator_group'])
        self.staff_group = self.create_group(ZDS_APP['member']['staff_group'])
        self.admin_group = self.create_group(ZDS_APP['member']['admin_group'])
        print("Done.")

    def create_bot_users(self):
        print("\nCreating bot users required to run the site...")
        self.create_bot_user(ZDS_APP['member']['anonymous_account'])
        self.create_bot_user(ZDS_APP['member']['external_account'])
        self.create_bot_user(ZDS_APP['member']['bot_account'], is_god=True)
        print("Done.")

    def import_users(self):
        print("\nImporting users...")

        with self.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute("SELECT COUNT(*) AS users_count FROM fluxbb_users")
            users_count = cursor.fetchone()['users_count']

            print("{} users to be imported".format(users_count))

            # TODO add location support into the new site
            cursor.execute('SELECT '
                           'fluxbb_users.id AS user_id, '
                           'fluxbb_users.username AS username, '
                           'fluxbb_users.email AS email, '
                           'fluxbb_users.url AS website, '
                           'fluxbb_users.signature AS signature, '
                           'fluxbb_users.show_sig AS show_signature, '
                           'fluxbb_users.registered AS registration_date, '
                           'fluxbb_users.last_visit AS last_visit, '
                           'fluxbb_users.admin_note AS admin_note, '
                           'fluxbb_users.title AS title, '
                           'fluxbb_groups.g_title AS group_name, '
                           '('
                           '  SELECT fluxbb_users.username'
                           '  FROM fluxbb_users'
                           '  WHERE fluxbb_users.id = fluxbb_bans.ban_creator'
                           ') AS ban_creator_username, '
                           'fluxbb_bans.expire AS ban_expiration, '
                           'fluxbb_bans.message AS ban_message '
                           'FROM fluxbb_users '
                           'INNER JOIN fluxbb_groups ON fluxbb_groups.g_id = fluxbb_users.group_id '
                           'LEFT OUTER JOIN fluxbb_bans ON fluxbb_bans.username = fluxbb_users.username '
                           'ORDER BY fluxbb_users.id')

            imported = 0
            for row in cursor.fetchall():
                if self.decode(row['username']) is 'Guest':
                    continue

                user = self.create_user(self.decode(row['username']))
                profile = user.profile

                # User data
                user.email = self.decode(row['email'])
                user.date_joined = datetime.datetime.fromtimestamp(row['registration_date'])
                user.last_login = datetime.datetime.fromtimestamp(row['last_visit'])

                profile.last_visit = user.last_login

                # Groups
                user.groups.add(self.member_group)

                group_name = unicode(row['group_name'], self.encoding)
                if group_name == 'Administrateurs':
                    user.groups.add(self.admin_group)
                    user.is_superuser = True
                elif group_name == 'Gardiens' or group_name == 'Modérateur':
                    user.groups.add(self.staff_group)
                elif group_name == 'Animateur':
                    user.groups.add(self.animator_group)

                # Profile
                profile.title = self.decode(row['title']) if row['title'] is not None else ''
                profile.site = self.decode(row['website']) if row['website'] is not None else ''

                # TODO Markdown conversion
                profile.sign = self.decode(row['signature']) if row['signature'] is not None else ''
                profile.show_sign = bool(row['show_signature'])

                # Avatar
                # FluxBB doesn't store the avatar URL, but retries each time to find the file type,
                # checking if the file exists for the three allowed extensions. Yes.
                avatar_url_pattern = 'https://forum.zcraft.fr/img/avatars/{}.{}'
                extensions = ['jpg', 'png', 'gif']
                for extension in extensions:
                    avatar_url = avatar_url_pattern.format(row['user_id'], extension)
                    r = requests.get(avatar_url)
                    if r.status_code == 200:
                        profile.set_avatar_from_file(StringIO(r.content), filename='avatar.{}'.format(extension))

                user.save()
                profile.save()

                # Administrative note imported as a karma note with score = 0
                if row['admin_note']:
                    KarmaNote(user=user, staff=user, comment=self.decode(row['admin_note']), value=0).save()

                # Bans
                if row['ban_creator_username']:
                    if row['ban_message']:
                        ban_message = self.decode(row['ban_message'])
                    else:
                        ban_message = 'Bannissement : aucun motif donné'

                    # A ban with an expiration date
                    if row['ban_expiration']:
                        days = (datetime.datetime.fromtimestamp(row['ban_expiration']) - datetime.datetime.now()).days
                        if days > 0:
                            state = TemporaryBanSanction({
                                'ban-text': ban_message,
                                'ban-jrs': days
                            })
                            karma_score = -10
                        else:
                            state = None
                            karma_score = 0
                    else:
                        state = BanSanction({
                            'ban-text': ban_message
                        })
                        karma_score = -20

                    if state:
                        try:
                            moderator = User.objects.filter(username=self.decode(row['ban_creator_username'])).first()
                            if not moderator:
                                moderator = User.objects.filter(username=ZDS_APP['member']['bot_account']).first()

                            ban = state.get_sanction(moderator, user)
                            state.apply_sanction(profile, ban)

                            KarmaNote(user=user, staff=moderator, comment=ban_message,
                                      value=karma_score).save()

                            profile.karma += karma_score
                            profile.save()

                        except ValueError as e:
                            self.stderr.write(' Unable to import ban for {}: error: {}'.format(user.username, e))

                imported += 1
                percentage = int((float(imported) / float(users_count)) * 100)
                self.print_progress("[{}% - {}/{}] Importing user {}...".format(percentage, imported, users_count,
                                                                                user.username))

        print("\nDone.")

    def import_forums(self):
        print("\nImporting forums...")

        print("\nDone.")

    def import_topics(self):
        print("\nImporting topics...")

        print("\nDone.")

    @staticmethod
    def create_user(username, is_bot=False):
        user, _ = User.objects.get_or_create(username=username)
        profile, _ = Profile.objects.get_or_create(user=user)

        user.set_unusable_password()
        user.save()

        if not is_bot:
            profile.migrated = False
            profile.save()

        return user

    def create_bot_user(self, username, is_god=False):
        """
        Creates a bot user. The user is only updated if it exists.

        :param username: The username of the user.
        :param is_god: True to make this user a public God.
        """
        print("  Creating bot user " + username + (" (god)" if is_god else "") + "...")
        user = self.create_user(username, is_bot=True)
        user.groups.add(self.bot_group)
        if is_god:
            user.groups.add(self.god_group)
        user.save()

    @staticmethod
    def create_group(group_name):
        print("  Creating group " + group_name + "...")
        group, created = Group.objects.get_or_create(name=group_name)
        return group

    @staticmethod
    def print_progress(text):
        stdout.write('\r                                                         ')
        stdout.write('\r' + text)
        stdout.flush()

    def decode(self, text):
        return unicode(text, self.encoding) if text is not None else None
