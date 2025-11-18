import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';

void main() {
  runApp(const MeuAppEngenharia());
}

class MeuAppEngenharia extends StatelessWidget {
  const MeuAppEngenharia({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recomendação IA',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const TelaPrincipal(),
    );
  }
}

class TelaPrincipal extends StatefulWidget {
  const TelaPrincipal({super.key});

  @override
  State<TelaPrincipal> createState() => _TelaPrincipalState();
}

class _TelaPrincipalState extends State<TelaPrincipal> {
  List<dynamic> locais = [];
  bool carregando = false;
  String mensagemErro = "";

  // SEU IP DA REDE CABEADA (USB TETHERING)
  // Troque pelo seu IP do Wi-Fi
  // IP do Wi-Fi (Conexão sem fio)
  final String urlServidor = 'http://192.168.0.13:3000/recomendacoes';

  // --- FUNÇÃO 1: BUSCAR DADOS COM GPS ---
  Future<void> buscarLocais() async {
    setState(() {
      carregando = true;
      mensagemErro = "";
      locais = [];
    });

    try {
      // 1. Checa permissão
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw "Você precisa autorizar o GPS.";
        }
      }
      if (permission == LocationPermission.deniedForever) {
        throw "GPS bloqueado nas configurações.";
      }

      // 2. Pega posição (Isso pode demorar 2-3 segundos)
      // print("Buscando GPS...");
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);

      // print("GPS: ${position.latitude}, ${position.longitude}");

      // 3. Manda para o Node.js com Lat/Lon
      final String urlComGps =
          '$urlServidor?lat=${position.latitude}&lon=${position.longitude}';

      final response = await http.get(Uri.parse(urlComGps));

      if (response.statusCode == 200) {
        setState(() {
          locais = jsonDecode(response.body);
          carregando = false;
        });
      } else {
        setState(() {
          mensagemErro = "Erro no servidor: ${response.statusCode}";
          carregando = false;
        });
      }
    } catch (e) {
      setState(() {
        mensagemErro = "Erro: $e";
        carregando = false;
      });
    }
  }

  // --- FUNÇÃO 2: REGISTRAR VISITA ---
  Future<void> registrarVisita(int localId, String nomeLocal) async {
    final String urlVisita =
        urlServidor.replaceFirst('/recomendacoes', '/registrar_visita');

    try {
      final response = await http.post(
        Uri.parse(urlVisita),
        headers: {"Content-Type": "application/json"},
        body:
            jsonEncode({"usuario_id": "aluno_engenharia", "local_id": localId}),
      );

      if (response.statusCode == 200) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Visita registrada em: $nomeLocal"),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("Erro ao enviar visita."),
            backgroundColor: Colors.red),
      );
    }
  }

  IconData getIconePorTipo(String? tipo) {
    if (tipo == null) return Icons.place;
    if (tipo.contains('Emergência')) return Icons.local_hospital;
    if (tipo.contains('Alimentação')) return Icons.restaurant;
    if (tipo.contains('Lazer')) return Icons.nightlife;
    return Icons.map;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Locais Próximos (IA)'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: buscarLocais,
                icon: const Icon(Icons.satellite_alt),
                label: const Text("Buscar Locais Reais"),
                style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 15)),
              ),
            ),
            const SizedBox(height: 20),
            if (carregando) const CircularProgressIndicator(),
            if (mensagemErro.isNotEmpty)
              Text(mensagemErro,
                  style: const TextStyle(
                      color: Colors.red, fontWeight: FontWeight.bold)),
            Expanded(
              child: locais.isEmpty && !carregando
                  ? const Center(child: Text("Clique no botão para buscar."))
                  : ListView.builder(
                      itemCount: locais.length,
                      itemBuilder: (context, index) {
                        final local = locais[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          elevation: 3,
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.deepPurple.shade100,
                              child: Icon(getIconePorTipo(local['tipo']),
                                  color: Colors.deepPurple),
                            ),
                            title: Text(local['nome'] ?? 'Local',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold)),
                            subtitle: Text(
                                "${local['tipo']} • ${local['endereco']}",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis),
                            trailing:
                                const Icon(Icons.touch_app, color: Colors.grey),
                            onTap: () {
                              registrarVisita(local['id'] ?? 0, local['nome']);
                            },
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
