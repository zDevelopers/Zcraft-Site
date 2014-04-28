# coding: utf-8

from random import randint
from django.conf import settings

from zds.forum.factories import CategoryFactory, ForumFactory, TopicFactory, PostFactory
from zds.tutorial.factories import BigTutorialFactory, PartFactory, ChapterFactory, NoteFactory
from zds.article.models import Article, Validation
from zds.mp.factories import PrivateTopicFactory, PrivatePostFactory
from zds.member.factories import UserFactory, StaffFactory, ProfileStaffFactory, ProfileFactory
from zds.utils.models import CommentLike, CommentDislike


"""
Load members
"""
profiles = []
for i in range(0, settings.NB_USERS):
    profiles.append(ProfileFactory())

"""
Load staff
"""
profile_staffs = []
for i in range(0, settings.NB_STAFFS):
    profile_staffs.append(ProfileStaffFactory())

"""
Load categories
"""
categories = []
for i in range(0, settings.NB_CATEGORIES):
    categories.append(CategoryFactory(position=i + 1))

"""
Load forums
"""
forums = []
for i in range(0, settings.NB_FORUMS):
    forums.append(ForumFactory(
                               category=categories[i % settings.NB_CATEGORIES],
                               position_in_category=(i / settings.NB_CATEGORIES) + 1
                               )
                  )

"""
Load topics
"""
topics = []
for i in range(0, settings.NB_TOPICS):
    topics.append(TopicFactory(
                               forum=forums[i % settings.NB_FORUMS], 
                               author=profiles[i % settings.NB_USERS].user
                               )
                  )

"""
Load posts
"""
posts = []
for i in range(0, settings.NB_TOPICS):
    nb = randint(0, settings.NB_MEAN_POSTS_IN_TOPIC * 2)
    for j in range(0, nb):
        posts.append(PostFactory(topic=topics[i], author=profiles[j % settings.NB_USERS].user, position = j+1))

"""
Load tutorials
"""
tutorials = []
parts = []
chapters = []

for i in range(0, settings.NB_BIGTUTOS):
    tuto = BigTutorialFactory()
    tuto.authors.add(profiles[i % settings.NB_USERS].user)
    tutorials.append(tuto)
    nb_part = randint(0, settings.NB_MEAN_PARTS_IN_TUTO * 2)
    for j in range(0, nb_part):
        parts.append(PartFactory(tutorial=tutorials[i], position_in_tutorial=j))
        nb_chap = randint(0, settings.NB_MEAN_CHAPTERS_IN_PART * 2)
        for k in range(0, nb_chap):
            chapters.append(ChapterFactory(part=parts[j], position_in_part=k, position_in_tutorial=j * k))
