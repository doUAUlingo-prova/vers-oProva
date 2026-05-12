import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>doUAUlingo</Text>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.login}>ENTRAR</Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.mascotCircle}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/068/873/860/non_2x/capybara-wearing-graduation-cap-looks-intelligent-and-proud-symbolizing-achievement-and-education-this-charming-animal-captures-essence-of-celebration-and-success-png.png",
              }}
              style={styles.mascotImage}
            />
          </View>

          <Text style={styles.title}>
            Acompanhe seu Toyota de forma simples e divertida
          </Text>

          <Text style={styles.subtitle}>
            Veja o status do seu veículo, agende a retirada e acompanhe tudo em
            um só app.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.primaryText}>COMEÇAR AGORA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>JÁ TENHO UMA CONTA</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    paddingBottom: 30,
  },

  header: {
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  login: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1cb0f6",
  },

  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  mascotCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 4,
    borderColor: "#58cc02",
    overflow: "hidden",
  },

  mascotImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
    lineHeight: 34,
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 23,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 34,
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },

  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 14,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  secondaryText: {
    color: "#1cb0f6",
    fontSize: 15,
    fontWeight: "900",
  },

  cards: {
    marginTop: 32,
    paddingHorizontal: 22,
  },

  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  cardIcon: {
    fontSize: 26,
    marginRight: 12,
  },

  cardText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#4b4b4b",
  },

  footer: {
    textAlign: "center",
    marginTop: 24,
    color: "#aaa",
    fontSize: 12,
  },
});