import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:locksy_x/features/blocked_numbers/controllers/blocked_numbers_controller.dart';

class BlockedNumbersView extends GetView<BlockedNumbersController> {
  const BlockedNumbersView({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController numberController = TextEditingController();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Taqiqlangan Raqamlar'),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Add number
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: numberController,
                      decoration: const InputDecoration(
                        hintText: '+998901234567',
                        labelText: 'Raqam kiritish',
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: () {
                      controller.addNumber(numberController.text);
                      numberController.clear();
                    },
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(60, 54),
                    ),
                    child: const Icon(Icons.add),
                  )
                ],
              ),
              const SizedBox(height: 24),
              
              // Global
              const Text('Global Bloklangan (Admin)', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              if (controller.globalNumbers.isEmpty)
                const Text('Hozircha yo\'q', style: TextStyle(color: Colors.grey)),
              ...controller.globalNumbers.map((n) => Card(
                color: Colors.red.withOpacity(0.1),
                child: ListTile(
                  leading: const Icon(Icons.phone_disabled, color: Colors.redAccent),
                  title: Text(n['number'], style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              )),
              
              const SizedBox(height: 24),
              
              // User specific
              const Text('Sizning Bloklanganlaringiz', style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 8),
              if (controller.userNumbers.isEmpty)
                const Text('Hozircha yo\'q', style: TextStyle(color: Colors.grey)),
              ...controller.userNumbers.map((n) => Card(
                color: Colors.blue.withOpacity(0.1),
                child: ListTile(
                  leading: const Icon(Icons.phone_disabled, color: Colors.blueAccent),
                  title: Text(n['number'], style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              )),
            ],
          ),
        );
      }),
    );
  }
}
