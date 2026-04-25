import 'dart:convert';

class SecretModel {
  final String id;
  final String title;
  final String category; // e.g. 'PASSWORD', 'NOTE', 'BANK_CARD'
  final String encryptedData; // AES bilan shifrlangan JSON (login/parol yoki matn)
  final DateTime createdAt;

  SecretModel({
    required this.id,
    required this.title,
    required this.category,
    required this.encryptedData,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'category': category,
      'encryptedData': encryptedData,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory SecretModel.fromMap(Map<String, dynamic> map) {
    return SecretModel(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      category: map['category'] ?? 'NOTE',
      encryptedData: map['encryptedData'] ?? '',
      createdAt: DateTime.parse(map['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  String toJson() => json.encode(toMap());

  factory SecretModel.fromJson(String source) => SecretModel.fromMap(json.decode(source));
}
