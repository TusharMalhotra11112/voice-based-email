# Rest api with fastapi

## Prerequsites

1. python
2. fastapi
3. pymysql

## To install the required packages.

```bash
pip install -r requirements.txt
```

## To freeze the environment locally use this command.

```bash
pip freeze -l requirements.txt
```

### Note

- Use python virtual environment to run this project. (optional)

### Docs (steps to run server)

1. Creat user_data table in the select database in mysql.

```sql
CREATE TABLE your_table_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_id VARCHAR(255),
    password VARCHAR(255),
    audio_1 LONGBLOB,
    audio_2 LONGBLOB,
    audio_3 LONGBLOB
);
```

2. Create the database url in main.py page.

```py
engine = create_engine("mysql+pymysql://<db_user>:<password>@<host>/<db>")
```

3. How to run the rest api.

```bash
# inside the backend-folder
uvicorn main:app --reload

# this command starts the server (at http://localhost:8000)
```

3. How to hit the reigster route from frontend (react js)

```js
let formData = new FormData();
formData.append("email", "hello@gmail.com");
formData.append("password", "password123");
formData.append("files", audioBlob_1, "file1.wav");
formData.append("files", audioBlob_2, "file2.wav");
formData.append("files", audioBlob_3, "file3.wav");

fetch("http://localhost:8000/register", {
  method: "POST",
  body: formData,
})
  .then((data) => data.json())
  .then((res) => console.log(res));

// response will be {'status':'success'}
```

### Database table structure

1. user_data table

```sql
  CREATE TABLE user_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_id VARCHAR(255),
  password VARCHAR(255),
  audio_1 LONGBLOB,
  audio_2 LONGBLOB,
  audio_3 LONGBLOB
  );
```
