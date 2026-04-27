import requests
import random

def envoyer_code_sms(numero, code):
    try:
        if not numero.startswith('+'):
            numero = '+221' + numero.replace(' ', '')

        message = f"HOSPI-INFO : Votre code de verification est {code}. Valable 5 minutes."

        response = requests.post(
            'https://api.sandbox.africastalking.com/version1/messaging',
            data={
                'username': 'sandbox',
                'to': numero,
                'message': message,
            },
            headers={
                'apiKey': '0AiBggDro',
                'Accept': 'application/json',
            },
            verify=False
        )

        print(f"Réponse Africa's Talking : {response.text}")

        if response.status_code == 201:
            return True
        else:
            print(f"Erreur : {response.text}")
            return False

    except Exception as e:
        print(f"Erreur SMS : {e}")
        return False