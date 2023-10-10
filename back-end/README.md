# Rest api with fastapi

## Prerequsites

1. python
2. fastapi

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

### Docs

1. How to run the rest api.

   ```bash
   # inside the backend-folder
   uvicorn main:app --reload

   # this command starts the server (at http://localhost:8000)
   ```

2. How to hit the reigster route from frontend (react js)

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

   // response will be {'status':'ok'}
   ```
