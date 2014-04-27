# encoding: utf-8
'''
Generates an users.yaml fixture file

Created on 27 avr. 2014

@author: SpaceFox
'''
import settings as s

f = open('forums.yaml', 'w')

for i in range(0, s.NB_CATEGORIES):
    f.write('-   model: forum.Category\n')
    f.write('    pk: %d\n' % (i))
    f.write('    fields:\n')
    f.write('        title: Category %d\n' % (i))
    f.write('        slug: category-%d\n' % (i))

for i in range(0, s.NB_FORUMS):
    f.write('-   model: forum.Forum\n')
    f.write('    pk: %d\n' % (i))
    f.write('    fields:\n')
    f.write('        title: Forum %d\n' % (i))
    f.write('        subtitle: Subtitle for Forum %d\n' % (i))
    f.write('        category: %d\n' % (i % s.NB_CATEGORIES))
    f.write('        slug: forum-%d\n' % (i))

f.close()
