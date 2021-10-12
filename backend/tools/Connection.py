from flask_pymongo import pymongo
from configurations.DatabaseConfig import DatabaseConfig
from dotenv import load_dotenv
import os

class Connection:

    @staticmethod
    def get_database():
        try:
            client = pymongo.MongoClient(os.getenv('MONGO_URI'))
            db = client.get_database(DatabaseConfig.DATABASE)
            return db
        except Exception as ex:
            print(ex)
            raise Exception from ex