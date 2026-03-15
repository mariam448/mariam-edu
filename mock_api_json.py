from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# قراءة بيانات الدروس من JSON
with open('pedagogical_data.json', 'r', encoding='utf-8') as f:
    MOCK_DATA = json.load(f)

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Aucune donnée reçue"}), 400

    lesson_code = data.get('lesson')
    if not lesson_code:
        return jsonify({"status": "error", "message": "Clé 'lesson' manquante"}), 400

    # البحث في MOCK_DATA
    lesson = next((d for d in MOCK_DATA if d['code'] == lesson_code), None)
    if not lesson:
        return jsonify({"status": "error", "message": "Code de leçon introuvable"}), 404

    # توليد نص الفيشة (يمكن لاحقاً LaTeX)
    content = f"=== {lesson['title']} ===\n\n"
    content += "Definitions:\n" + "\n".join(lesson['definitions']) + "\n\n"
    content += "Activities:\n" + "\n".join(lesson['activities']) + "\n\n"
    content += "Exercises:\n" + "\n".join(lesson['exercises'])

    return jsonify({"status": "success", "content": content})

if __name__ == '__main__':
    app.run(debug=True)