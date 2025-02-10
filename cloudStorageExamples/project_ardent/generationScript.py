import os

# Define the folder structure and files to be created
file_structure = {
    "reports/2025/january/": [
        ("sales_report.csv", "id,name,amount\n1,John Doe,1000\n2,Jane Doe,2000"),
        ("analytics_data.csv", "date,visits,conversions\n2025-01-01,500,30\n2025-01-02,450,28")
    ],
    "reports/2025/february/": [
        ("user_data.csv", "user_id,email,signup_date\n101,john@example.com,2025-02-01\n102,jane@example.com,2025-02-02")
    ],
    "documents/guides/": [
        ("getting_started.txt", "This is a guide to help you get started with the system."),
        ("troubleshooting_guide.txt", "If you encounter issues, follow these troubleshooting steps.")
    ],
    "documents/legal/": [
        ("terms_of_service.txt", "These are the terms of service for using our platform."),
        ("privacy_policy.txt", "We take your privacy seriously. This document outlines our policies.")
    ]
}

# Function to create directories and write files
def create_files():
    for folder, files in file_structure.items():
        os.makedirs(folder, exist_ok=True)  # Create directory if it doesn't exist
        for file_name, content in files:
            file_path = os.path.join(folder, file_name)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Created: {file_path}")

# Run the function
if __name__ == "__main__":
    create_files()