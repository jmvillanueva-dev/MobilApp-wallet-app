import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Datos quemados para los participantes
const PARTICIPANTS = ["Juan", "María", "Pedro"];

// Tipamos las props que recibirá el componente
type AddExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddExpense: (
    description: string,
    amount: number,
    paidBy: string,
    participants: string[],
    receiptUri: string
  ) => void;
};

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  visible,
  onClose,
  onAddExpense,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(PARTICIPANTS[0]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  const [receiptUri, setReceiptUri] = useState<string | null>(null); // NUEVO: Estado para guardar la URI de la imagen

  // NUEVO: Función para abrir la cámara
  const handleTakePhoto = async () => {
    // Solicitar permisos de la cámara
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso Requerido", "Necesitas dar permiso para acceder a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const toggleParticipant = (name: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const handleAddExpense = () => {
    // VALIDACIÓN ACTUALIZADA
    if (
      !description ||
      !amount ||
      selectedParticipants.length === 0 ||
      !receiptUri
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos, incluyendo la foto del recibo."
      );
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Monto inválido", "El monto debe ser un número positivo.");
      return;
    }

    // Pasa la URI real en lugar de la simulada
    onAddExpense(
      description,
      numericAmount,
      paidBy,
      selectedParticipants,
      receiptUri // URI real de la imagen
    );

    // Limpia todos los campos del formulario, incluyendo la imagen
    setDescription("");
    setAmount("");
    setPaidBy(PARTICIPANTS[0]);
    setSelectedParticipants([]);
    setReceiptUri(null); // Limpia la imagen
    onClose();
  };

  // Limpia el estado si el modal se cierra sin guardar
  const handleClose = () => {
    setDescription("");
    setAmount("");
    setPaidBy(PARTICIPANTS[0]);
    setSelectedParticipants([]);
    setReceiptUri(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Gasto</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={28} color="#6B7281" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Cena con amigos"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Monto *</Text>
          <TextInput
            style={styles.input}
            placeholder="$ 0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>¿Quién pagó? *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paidBy}
              onValueChange={(itemValue) => setPaidBy(itemValue)}
            >
              {PARTICIPANTS.map((p) => (
                <Picker.Item key={p} label={p} value={p} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Participantes *</Text>
          <View style={styles.participantsContainer}>
            {PARTICIPANTS.map((name) => (
              <TouchableOpacity
                key={name}
                style={[
                  styles.participantChip,
                  selectedParticipants.includes(name) &&
                    styles.participantChipSelected,
                ]}
                onPress={() => toggleParticipant(name)}
              >
                <Text
                  style={[
                    styles.participantText,
                    selectedParticipants.includes(name) &&
                      styles.participantTextSelected,
                  ]}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>
            Foto del Recibo{" "}
            <Text style={styles.requiredText}>* Obligatorio</Text>
          </Text>

          <TouchableOpacity style={styles.photoBox} onPress={handleTakePhoto}>
            {receiptUri ? (
              <Image
                source={{ uri: receiptUri }}
                style={styles.receiptImagePreview}
              />
            ) : (
              <>
                <Feather name="camera" size={32} color="#6B7281" />
                <Text style={styles.photoBoxText}>Tomar Foto del Recibo</Text>
                <Text style={styles.photoBoxSubText}>
                  Es necesario para registrar el gasto
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddExpense}
          >
            <Feather
              name="camera"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.saveButtonText}>Guardar Gasto con Recibo</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  form: { padding: 16 },
  label: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  participantsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  participantChip: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  participantChipSelected: {
    backgroundColor: "#3B82F6",
  },
  participantText: {
    color: "#1F2937",
    fontSize: 16,
  },
  participantTextSelected: {
    color: "white",
  },
  requiredText: {
    color: "#EF4444",
    fontSize: 12,
  },
  photoBox: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 150, // Altura fija para la vista previa
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    overflow: "hidden", // Para que la imagen no se salga de los bordes redondeados
  },
  photoBoxText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
  },
  photoBoxSubText: {
    fontSize: 14,
    color: "#6B7281",
    marginTop: 4,
  },
  receiptImagePreview: {
    // NUEVO: Estilo para la vista previa de la imagen
    width: "100%",
    height: "100%",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});