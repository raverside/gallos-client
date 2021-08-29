## Gallos Club
**Technology Stack**


- Frontend:
    - Ionic React
- Backend:
    - Node.js (Express)
    - Socket.io
- Database:
    - PostgreSQL Sequelize



## Stack note
Ionic React is great for building fluid and responsive cross-platform PWAs. It has lots of QOL features and useful Components that simplify and shorten the development, while also enforcing a certain level of code quality.

Node.js paired with socket.io will provide a fast server capable of establishing 2-way connections, useful for updating client data on demand, meaning that we'll be able to handle real-time updates easily.

PostgreSQL is a powerful, object-relational database system that supports all modern db features such as indexes, migrations, transactions, relations, constrains etc and it's scalable, secure and easy to optimize.
Sequelize is a postgres-node.js ORM that will help keeping the queries clean, readable and optimized.
Sequelize will also handle the migrations which will be useful for rebuilding/updating the database structure in multiple environments.

Project will be built considering 2 possible environments: dev and prod
Some features might only be available in dev or prod environment, this will be defined in config.
