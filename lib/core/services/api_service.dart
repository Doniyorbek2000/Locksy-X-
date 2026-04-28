import 'package:dio/dio.dart';

import 'dart:io' show Platform;

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late Dio _dio;

  ApiService._internal() {
    // PRODUCTION: Render.com dagi backend manzili
    String baseUrl = 'https://locksy-x.onrender.com';
    
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30), // Vaqtni biroz uzaytirdik (Render bepul bo'lgani uchun)
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Xatoliklarni kuzatish uchun interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onError: (DioException e, handler) {
        print('API XATOLIK: ${e.type} - ${e.message}');
        print('URL: ${e.requestOptions.uri}');
        return handler.next(e);
      },
    ));
  }

  Future<String> getUserRegion() async {
    try {
      final response = await Dio().get('http://ip-api.com/json');
      if (response.statusCode == 200) {
        return "${response.data['country']}, ${response.data['city']}";
      }
      return 'Unknown Region';
    } catch (e) {
      return 'Unknown (Offline)';
    }
  }

  Future<void> registerUser(String locksyId, String region) async {
    try {
      await _dio.post('/users/register', data: {
        'locksyId': locksyId,
        'region': region,
      });
    } catch (e) {
      // ignore
    }
  }

  Future<String> getGuide(String lang) async {
    try {
      final response = await _dio.get('/guides/$lang');
      return response.data['content'] ?? 'No guide available.';
    } catch (e) {
      return 'Failed to load guide.';
    }
  }

  Future<List<dynamic>> getActiveAds() async {
    try {
      final response = await _dio.get('/ads/active');
      return response.data;
    } catch (e) {
      return [];
    }
  }

  Future<List<dynamic>> getNotifications() async {
    try {
      final response = await _dio.get('/notifications');
      return response.data;
    } catch (e) {
      return [];
    }
  }

  Future<List<dynamic>> getBlockedNumbers(String locksyId) async {
    try {
      final response = await _dio.get('/blocked-numbers/user/$locksyId');
      return response.data;
    } catch (e) {
      return [];
    }
  }

  Future<void> addBlockedNumber(String locksyId, String number) async {
    try {
      await _dio.post('/blocked-numbers', data: { 'number': number, 'userId': locksyId });
    } catch (e) {
      print(e);
    }
  }

  Future<Map<String, dynamic>> getStats() async {
    try {
      final response = await _dio.get('/stats');
      return response.data;
    } catch (e) {
      return {
        'riskApps': 0,
        'blockedLinks': 0,
        'adminBlocked': 0,
        'totalUsers': 0,
      };
    }
  }

  Future<Map<String, dynamic>> scanApk(String packageName, List<String> permissions) async {
    try {
      final response = await _dio.post('/scan/apk', data: {
        'packageName': packageName,
        'permissions': permissions,
      });
      return response.data;
    } catch (e) {
      throw Exception('Server bilan bog\'lanishda xatolik: $e');
    }
  }

  Future<Map<String, dynamic>> scanUrl(String url) async {
    try {
      final response = await _dio.post('/scan/url', data: {
        'url': url,
      });
      return response.data;
    } catch (e) {
      throw Exception('Server bilan bog\'lanishda xatolik: $e');
    }
  }

  // Global xavflar bazasini yuklab olish (Linklar + Raqamlar)
  Future<Map<String, dynamic>> getGlobalThreats() async {
    try {
      final response = await _dio.get('/threats/global');
      return response.data;
    } catch (e) {
      return {
        'urls': [],
        'numbers': [],
        'maliciousPackages': [],
      };
    }
  }

  Future<Map<String, dynamic>> checkUpdate() async {
    try {
      final response = await _dio.get('/updates/check');
      return response.data;
    } catch (e) {
      return {};
    }
  }
}
