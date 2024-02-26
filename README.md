# Youtube Data Aggregator

## Description
The Youtube Data Aggregator is a tool that allows you to generate and aggregate data from multiple Youtube channels. It provides a simple and efficient way to collect information such as video titles, descriptions, view counts, and more.

## Installation
To use the Youtube Data Aggregator, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/youtube-data-aggregator.git
    ```

2. Install the required dependencies:
    ```bash
    cd youtube-data-aggregator
    npm install
    ```

## Usage
To use the Youtube Data Aggregator, follow these steps:

1. Set up your Youtube API credentials:
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project or select an existing one.
    - Enable the Youtube Data API v3 for your project.
    - Create API credentials (OAuth 2.0 client ID) and download the JSON file.

2. Configure the application:
    - Add an .env file, and specify the following environment variables:
        - `YOUTUBE_API_KEY`: Your personal API Key from Youtube API v3


3. Run the application (Front-end):
    ```bash
    npm run dev
    ```
4. Run the application (Back-end):
    ```bash
    cd src
    cd helper
    node route.js
    ```



4. Access the application:
    - Open your web browser and navigate to the local host port displayed in the terminal.
    - Use the provided interface to enter the Youtube channel IDs and select the data you want to generate.

## Contributing
Contributions are welcome! If you would like to contribute to the Youtube Data Aggregator, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.
