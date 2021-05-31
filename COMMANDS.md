[PRODUCTION]

UP
 - docker-compose up -d --build --remove-orphans

DOWN
 - docker-compose down --rmi local -v --remove-orphans

Production environment file: .env

[DEVELOPMENT]

UP
 - docker-compose -f docker-compose-test.yml --env-file=.test up -d --build --remove-orphans

DOWN
 - docker-compose down --rmi local -v --remove-orphans

Development environemnt file: .test
