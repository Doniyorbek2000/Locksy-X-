import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/core/services/api_service.dart';
import 'package:locksy_x/routes/app_pages.dart';
import 'package:url_launcher/url_launcher.dart' as url_launcher;

class SettingsView extends StatelessWidget {
  const SettingsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('settings'.tr),
      ),
      body: ListView(
        children: [
          // Language Tile
          _SectionHeader(title: '🌐 Til Sozlamalari'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF131A28),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF233045)),
            ),
            child: ListTile(
              leading: const Icon(Icons.language, color: Color(0xFF00B0FF)),
              title: Text('language'.tr, style: const TextStyle(color: Colors.white)),
              trailing: DropdownButton<String>(
                dropdownColor: const Color(0xFF131A28),
                value: Get.locale?.languageCode ?? 'uz',
                style: const TextStyle(color: Colors.white),
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(value: 'uz', child: Text("O'zbekcha")),
                  DropdownMenuItem(value: 'ru', child: Text('Русский')),
                  DropdownMenuItem(value: 'en', child: Text('English')),
                ],
                onChanged: (val) {
                  if (val != null) {
                    Get.updateLocale(Locale(val));
                  }
                },
              ),
            ),
          ),

          // Guide Tile
          _SectionHeader(title: '📖 Qo\'llanma'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF131A28),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF233045)),
            ),
            child: ListTile(
              leading: const Icon(Icons.menu_book, color: Color(0xFF00E676)),
              title: Text('guide'.tr, style: const TextStyle(color: Colors.white)),
              subtitle: const Text('Dasturdan foydalanish bo\'yicha', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
              trailing: const Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () async {
                Get.dialog(const Center(child: CircularProgressIndicator()));
                final api = Get.find<ApiService>();
                final guide = await api.getGuide(Get.locale?.languageCode ?? 'uz');
                Get.back();
                Get.dialog(
                  Dialog(
                    backgroundColor: const Color(0xFF131A28),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.menu_book, color: Color(0xFF00E676)),
                              const SizedBox(width: 8),
                              Text('guide'.tr, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const Divider(color: Color(0xFF233045), height: 24),
                          SingleChildScrollView(
                            child: Text(guide, style: const TextStyle(color: Color(0xFF94A3B8), height: 1.5)),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () => Get.back(),
                            child: const Text('Yopish'),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Blocked Numbers Tile
          _SectionHeader(title: '🚫 Xavfsizlik'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF131A28),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF233045)),
            ),
            child: ListTile(
              leading: const Icon(Icons.phone_disabled, color: Colors.orange),
              title: const Text('Taqiqlangan Raqamlar', style: TextStyle(color: Colors.white)),
              subtitle: const Text('Admin va o\'z raqamlaringizni bloklash', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
              trailing: const Icon(Icons.chevron_right, color: Colors.grey),
              onTap: () => Get.toNamed(AppRoutes.BLOCKED_NUMBERS),
            ),
          ),

          // Partnership Tile
          _SectionHeader(title: '🤝 Hamkorlik'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF131A28),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF233045)),
            ),
            child: ListTile(
              leading: const Icon(Icons.telegram, color: Color(0xFF29B6F6)),
              title: Text('partnership'.tr, style: const TextStyle(color: Colors.white)),
              subtitle: const Text('@nkmk_uz', style: TextStyle(color: Color(0xFF29B6F6), fontSize: 12)),
              trailing: const Icon(Icons.open_in_new, color: Colors.grey, size: 18),
              onTap: () async {
                final url = Uri.parse('https://t.me/nkmk_uz');
                try {
                  await url_launcher.launchUrl(url, mode: url_launcher.LaunchMode.externalApplication);
                } catch (e) {
                  Get.snackbar('Xato', 'Telegram ocholmadi');
                }
              },
            ),
          ),

          const SizedBox(height: 30),

          // About Section
          Center(
            child: Column(
              children: [
                const Icon(Icons.shield, size: 40, color: Color(0xFF00E676)),
                const SizedBox(height: 8),
                const Text('LOCKSY X', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                const Text('v1.0.0 — Professional Security', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 6),
      child: Text(title, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
    );
  }
}
