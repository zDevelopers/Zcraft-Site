# encoding: utf-8
'''
Generates an topics.yaml fixture file

Created on 27 avr. 2014

@author: SpaceFox
'''

from datetime import datetime
import random

import settings as s


f = open('topics.yaml', 'w')
total_posts = 0;
current_post_id = 0;

for t in range(0, s.NB_TOPICS):
    
    topic = random.randint(0, s.NB_TOPICS)
    topic_auth = random.randint(0, s.NB_USERS)
    rate = 1 / float(s.NB_MEAN_POSTS_IN_TOPIC)
    nb_posts = int(random.expovariate(rate))
    total_posts += nb_posts
    
    f.write('-   model: forum.Topic\n')
    f.write('    pk: %d\n' % (t))
    f.write('    fields:\n')
    f.write('        title: Topic %d\n' % (t))
    f.write('        title: Subtitle for Topic %d\n' % (t))
    f.write('        forum: %d\n' % (topic))
    f.write('        author: %d\n' % (topic_auth))
    f.write('        pubdate: %s\n' % (datetime.now().isoformat()))
    f.write('        last_message: %d\n' % (current_post_id))
    
    for p in range(0, nb_posts):
        post_auth = topic_auth if p == 0 else random.randint(0, s.NB_USERS)
        f.write('-   model: forum.Post\n')
        f.write('    pk: %d\n' % (current_post_id))
        f.write('    fields:\n')
        f.write('        topic: %d\n' % (t))
        f.write('-   model: utils.Comment\n')
        f.write('    pk: %d\n' % (current_post_id))
        f.write('    fields:\n')
        f.write('        author: %d\n' % (post_auth))  
        f.write('        text: "Texte brut du message n°%d dans le topic n°%d\\nID du message : %d"\n' % (p, t, current_post_id))
        f.write('        text_html: "<div class=\'markdown\'><p>Texte HTML du message n°%d dans le topic n°%d</p><p>ID du message : %d</p></div>"\n' % (p, t, current_post_id))
        f.write('        like: %d\n' % (random.randint(0, 5)))  
        f.write('        dislike: %d\n' % (random.randint(0, 5)))  
        f.write('        pubdate: %s\n' % (datetime.now().isoformat()))
        f.write('        position: %d\n' % (p + 1))  
        current_post_id += 1

f.close()
