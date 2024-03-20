# Fiveplay

## Quick start guide

1. Clone the project
```sh
git clone \
https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09bfiveplay.git
```

2. Change directory into project

```sh
cd capstone-project-3900w09bfiveplay/  
```

3. Load the required submodules

```sh
git submodule update --init
```

4. Build the system (Note this step may take a couple of minutes)

```sh
docker compose build
```

5. Run the system

```
docker compose up
```

6. After the frontend compiles and showcases a url, view the system at the following link

```sh
http://localhost:3000
```

## OpenAPI Documentation
To reach the swagger documentatation for the backend api, access:
```
http://localhost:8000/docs
```

## Directory Structure
    .
    ├── ...
    ├── backend                         # Directory for the backend REST FastAPI
    │   ├── app                         # Primary source code directory for application code
    │   │   ├── auth                    # Token handling directory
    │   │   ├── integration_tests       # Integration tests
    │   │   ├── routers                 # Router abstractions for customer, manager, staff
    │   │   ├── sql_app                 # SQLAlchemy models, schemas and crud operations
    │   ├── main.py                     # Main router for FastAPI
    │   ├── settings.py                 # Pydantic settings for handling environment variables
    │   ├── requirements.txt            # Dependencies required to build project
    │   └── ...
    ├── frontend                        # Directory for the frontend React project
    │   ├── public                      # Public directory used to store base index.html and stylesheets
    │   ├── src                         # Primary source code directory
    │   │   ├── assets                  # Local image assets that are globally used across the app, e.g. icons
    │   │   ├── components              # Reusable components used across the project
    │   │   ├── containers              # Reusable container components used across the project
    │   │   ├── mocks                   # Mock handlers using MSW for component testing
    │   │   ├── pages                   # Pages to be rendered by the application
    │   │   ├── services                # RTKQuery Api slices for data fetching and automated caching
    │   │   ├── slices                  # Redux-Toolkit slices for global state management
    │   │   ├── store                   # Redux store setup
    │   │   ├── tests                   # Component tests
    │   │   ├── utils                   # Utility functions
    │   ├── App.tsx                     # Main entrypoint for the React project
    │   ├── types.ts                    # Types used across the project
    │   ├── package.json                # Dependencies required to build project
    │   └── ...
    ├── nginx                           # Directory for reverse-proxy container
    │   ├── default.conf                # Route mapping configuration file
    │   └── ...                         # 
    ├── postgres                        # Directory for postgres
    │   ├── sql                         # SQL initialization scripts
    │   └── ...           
    ├── docker-compose.yml              # Configuration for application services and containers
    └── ...

## Local development setup

### Required Dependencies
- Node (v18)
- npm
- Python v3.9
- pip

### Frontend local development

1. Install node modules

```sh
cd capstone-project-3900w09bfiveplay/frontend/   
npm install
```

2. Run the system
```sh
docker compose up frontend
```

3. To run tests

```sh
npm run test
```

### Backend local development
1. Install dependencies

```sh
cd capstone-project-3900w09bfiveplay/backend/   
pip install -r requirements.txt
```

2. Run the app

```sh
docker compose up backend
```

3. Run tests

```sh
docker compose exec -it backend pytest . 
```

