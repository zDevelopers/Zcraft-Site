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
profiles = ProfileFactory()

"""
Load category
"""
categories = CategoryFactory()

"""
Load forum
"""
forums = ForumFactory(category=categories, position_in_category=1)

"""
Load topic
"""
topics = TopicFactory(forum=forums, author=profiles.user)

"""
Load posts
"""
posts = []
for i in range(0, 400):
    print i
    posts.append(PostFactory(topic=topics, author=profiles.user, position = i+1))

