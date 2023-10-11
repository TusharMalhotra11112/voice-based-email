from sqlalchemy import create_engine, text


engine = create_engine("mysql+pymysql://root:1234@localhost:3306/voicebaseddata")
# INSERT INTO user_data (email_id, password, audio_1, audio_2, audio_3) VALUES ('hello@gmail.com', '1234', 'sfhsh33',
#  'sdfsf3', 'sfasigh3')

with engine.connect() as conn:
    # result = conn.execute("insert into user_data (email_id, password, audio_sections[0], audio_sections[1], audio_sections[2] values()")
    result = conn.execute(text("INSERT INTO user_data (email_id, password, audio_1,audio_2, audio_3) VALUES (:email_id,:password, :audio_1, :audio_2, :audio_3)"),
                          [{"email_id": 'new@proton', "password": '5612', "audio_1": "padls","audio_2": "mklsa", "audio_3":"dkl93k"}],)
    conn.commit()
    # print(result.all())