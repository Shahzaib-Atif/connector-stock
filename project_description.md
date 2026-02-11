
---

# 📦 Connector-Stock

### Inventory & Workflow Management System

**Connector-Stock** is a comprehensive management ecosystem designed to streamline the tracking, labeling, and movement of connectors and accessories. It bridges the gap between digital data entry and physical warehouse operations.

---

## 🛠 Core Services & Features

### 1. Label Printing Service

The system features deep integration with **TSC TE200** hardware for high-precision labeling.

* **QR Code Generation:** Dynamic generation for samples, boxes, and individual connectors.
* **Hardware Communication:** Utilizes **TSPL** (Printer Control Language) via a custom `RawPrinter.exe` utility, ensuring pixel-perfect alignment and direct hardware command execution.

### 2. Stock Management & Audit Trails

Maintain a "source of truth" for every item in the warehouse.

* **Granular Tracking:** Differentiates between connector states (e.g., **"With Wires"** vs. **"No Wires"**).
* **Automated Transactions:** Every action (registration, updates, or deletions) triggers an automatic **IN/OUT** log, ensuring stock levels remain synchronized without manual tallying.

### 3. Sample Registration Workflow

A guided, multi-step wizard designed to minimize human error during data entry.

* **Legacy Data Fetching:** Automatically pulls data from `AnaliseTab` or `ORC` documents to pre-fill forms.
* **Metadata Tracking:** Captures vital context including Client, Project, Delivery Department (*Entregue a*), and Receiver.

### 4. Component Registry

A centralized database for physical component mapping.
| Feature | Description |
| :--- | :--- |
| **Reference Mapping** | Links internal `CODIVMAC` codes to specific client references. |
| **Accessory Linking** | Automatically associates accessories with parent connectors to ensure complete kit movement. |

### 5. Notification & Request System

Streamlines inter-sector communication for item fulfillment.

* **Request Parsing:** Intelligent parsing of "Sample Requests" to identify required components.
* **Linked Fulfillment:** Deducts quantities from stock automatically once a request is linked to a physical sample.

### 6. Visual Asset Management

Provides visual verification to reduce picking errors.

* **Image Gallery:** Dedicated service for primary, extra, and accessory images.
* **Integrated Views:** Visual previews available directly within `AccessoryView` and `ConnectorView`.

---

> **Note:** This system requires the `RawPrinter.exe` utility to be present in the root directory for all label printing functionalities.
