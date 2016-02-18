# coding: utf-8

from django import template

from django.contrib.auth.models import User

from zds.member.models import Profile
from zds.utils.models import CommentLike, CommentDislike


register = template.Library()

states = {}


@register.filter('profile')
def profile(current_user):
    try:
        current_profile = current_user.profile
    except Profile.DoesNotExist:
        current_profile = None
    return current_profile


@register.filter('user')
def user(user_pk):
    try:
        current_user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        current_user = None
    return current_user


@register.filter('state')
def state(current_user):
    if current_user.pk in states:
        return states[current_user.pk]

    try:
        user_profile = current_user.profile
        if user_profile.is_god():
            user_state = 'GOD'
        elif not user_profile.user.is_active:
            user_state = 'DOWN'
        elif not user_profile.can_read_now():
            user_state = 'BAN'
        elif not user_profile.can_write_now():
            user_state = 'LS'
        elif user_profile.is_admin():
            user_state = 'ADMIN'
        elif user_profile.is_staff():
            user_state = 'STAFF'
        elif user_profile.is_animator():
            user_state = 'ANIMATOR'
        else:
            user_state = None
    except Profile.DoesNotExist:
        user_state = None

    print("State retrieved for {}: {}".format(current_user.username, user_state))

    return user_state


@register.filter('liked')
def liked(current_user, comment_pk):
    return CommentLike.objects.filter(comments__pk=comment_pk, user=current_user).exists()


@register.filter('disliked')
def disliked(current_user, comment_pk):
    return CommentDislike.objects.filter(comments__pk=comment_pk, user=current_user).exists()
