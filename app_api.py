# DEPRECATED: Worksheet generation now runs in Next.js API route (app/api/generate/route.ts)
# for Vercel deployment. You can remove or keep this file for local Python-only testing.

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyDkEoJ4TiPgqBxQ3X_QLlD5de1IqjihI-Y"
URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={API_KEY}"

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        lesson = data.get('lesson')
        level = data.get('level')

        # تجهيز الطلب بصيغة JSON التي تطلبها جوجل
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Tu es un expert en mathématiques au Maroc. Génère une fiche pédagogique en français pour le cours de {lesson} niveau {level}. Utilise LaTeX pour les formules."
                }]
            }]
        }
        
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(URL, json=payload, headers=headers)
        result = response.json()

        if "candidates" in result:
            text_content = result['candidates'][0]['content']['parts'][0]['text']
            return jsonify({"status": "success", "content": text_content})
        else:
            # طباعة الخطأ الحقيقي في التيرمينال لمعرفته
            print("Google Error Response:", result)
            return jsonify({"status": "error", "message": "Clé API invalide ou quota atteint"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)