import uuid, string, random

class RandomTool: 
    @staticmethod
    def get_random_id():
        return str(uuid.uuid4())
    @staticmethod
    def get_classroom_code():
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(6))
