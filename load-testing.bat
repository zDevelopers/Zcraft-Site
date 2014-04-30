python manage.py syncdb
python manage.py migrate
python manage.py flush
python manage.py shell < tests/fixtures/load-data.py