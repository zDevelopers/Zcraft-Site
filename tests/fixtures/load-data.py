# coding: utf-8

import settings
import random

from zds.forum.factories import CategoryFactory, ForumFactory, TopicFactory, PostFactory
from zds.tutorial.factories import BigTutorialFactory, PartFactory, ChapterFactory, NoteFactory
from zds.article.models import Article, Validation
from zds.mp.factories import PrivateTopicFactory, PrivatePostFactory
from zds.member.factories import UserFactory, StaffFactory
from zds.utils.models import CommentLike, CommentDislike



"""
Load members
"""
users = []
for i in range(0, settings.NB_USERS):
    users.append(UserFactory())

"""
Load staff
"""
staffs = []
for i in range(0, settings.NB_STAFFS):
    staffs.append(StaffFactory())

"""
Load categories
"""
categories = []
for i in range(0, settings.NB_CATEGORIES):
    categories.append(CategoryFactory(), position=i+1)

"""
Load forums
"""
forums = []
for i in range(0, settings.NB_FORUMS):
    forums.append(ForumFactory(category=categories[i%NB_CATEGORIES]), position_in_category=(i/NB_CATEGORIES)+1)

"""
Load topics
"""
topics = []
for i in range(0, settings.NB_TOPICS):
    topics.append(TopicFactory(forum=forums[i%NB_FORUMS], author=users[i%NB_USERS]))
    
"""
Load posts
"""
posts = []
for i in range(0, settings.NB_TOPICS):
    nb = randint(settings.NB_MEAN_POSTS_IN_TOPIC*2)
    for j in range(0, nb):
        posts.append(postFactory(topic=topics[i], author=users[j%NB_USERS]))

"""
Load tutorials
"""
tutorials = []
parts = []
chapters = []

for i in range(0, settings.NB_BIGTUTOS):
    tuto = BigTutorialFactory()
    tuto.authors.add(users[i%NB_USERS])
    tutorials.append(tuto)
    
    nb_part = randint(settings.NB_MEAN_PARTS_IN_TUTO*2)
    for j in range(0, nb_part):
        parts.append(PartFactory(tutorial=tutorials[i], position_in_tutorial=j))

        nb_chap = randint(settings.NB_MEAN_CHAPTERS_IN_PART*2)
        for k in range(0, nb_chap):
            chapters.append(ChapterFactory(part=parts[j], position_in_part = k, position_in_tutorial = j*k))
