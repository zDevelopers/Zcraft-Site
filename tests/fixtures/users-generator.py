# encoding: utf-8
'''
Generates an users.yaml fixture file

Created on 27 avr. 2014

@author: SpaceFox
'''

NB_USERS = 100

f = open('users.yaml', 'w')

for i in range(0, NB_USERS):
    f.write('-   model: auth.user\n')
    f.write('    pk: %d\n' % (i))
    f.write('    fields:\n')
    f.write('        first_name: GeneratedUser%d\n' % (i))
    f.write('        last_name: GeneraterdUser%d\n' % (i))
    f.write('        username: generateduser%d\n' % (i))
    f.write('        password: pbkdf2_sha256$10000$w5hhXcOg2pIT$gluvdmTKlbOJDpo9U/C3pWJOmOytbXX2N38j2iplNcM=\n')
    f.write('        is_superuser: False\n')
    f.write('-   model: member.Profile\n')
    f.write('    pk: %d\n' % (i))
    f.write('    fields:\n')
    f.write('        user: %d\n' % (i))
    f.write('        last_ip_address: 192.168.0.1\n')

f.close()