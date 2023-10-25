# Rest api with fastapi

## Prerequsites

1. python
2. fastapi
3. pymysql
4. sqlalchemy

## To install the required packages.

```bash
    pip install fastapi
```

```bash
    pip install "uvicorn[standard]"
```

```bash
    pip install sqlalchemy
```

```bash
    pip install pymysql
```

```bash
    pip install "uvicorn[standard]"
```

### Note

- Use python virtual environment to run this project. (optional)

### Docs (steps to run server)

1. Creat user_data table in the select database in mysql.

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

2. Create a password.txt file in the backend-end folder and put your db_url there.

```txt
mysql+pymysql://<db_user>:<password>@<host>/<db>
```

3. How to run the rest api.

```bash
# inside the backend-folder
uvicorn main:app --reload

# this command starts the server (at http://localhost:8000)
```

3. How to hit the register route from frontend (react js)

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
  email_id VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) UNIQUE,
  audio_1 LONGBLOB,
  audio_2 LONGBLOB,
  audio_3 LONGBLOB
  );
```
