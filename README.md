# Voice Based Email System

An application which runs the email services on your voice.

## Prerequsites

1. python
2. fastapi
3. pymysql
4. sqlalchemy
5. reactjs
6. nodejs

## How to run

1. Cloning the project

```bash
git clone git@github.com:TusharMalhotra11112/voice-based-email.git

cd voice-based-email
```

2. Installing packages

```bash
pip install -r back-end/requirements. txt

cd front-end && npm install && cd ..
```

3. Creat user_data table in the selected database in mysql.

```sql
CREATE TABLE your_table_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) UNIQUE,
    audio_1 LONGBLOB,
    audio_2 LONGBLOB,
    audio_3 LONGBLOB
);
```

4. Create a password.txt file in the backend-end folder and put your db_url there.

```txt
mysql+pymysql://<db_user>:<password>@<host>/<db>
```

5. Running the backend server.

```bash
# inside the backend-folder

uvicorn main:app --reload

# this command starts the server (at http://localhost:8000)
```

4. Starting the frontend application

```bash
# inside the front-end folder

npm run start

# this command starts the frontend application (at http://localhost:3000)
```

### Note

- Use python virtual environment to run this project. (optional)