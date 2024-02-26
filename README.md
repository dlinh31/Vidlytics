# Vidlytics: YouTube Data Aggregator

## Description
**Vidlytics** is a web application leveraging React.js and Node.js to aggregate YouTube channel data. It streamlines the collection of video details, view counts, and other metrics, supporting batch processing for multiple channels simultaneously.

## Features
- **Data Aggregation**: Collects data across multiple YouTube channels.
- **Detailed Analytics**: Retrieves titles, descriptions, views, and more.
- **Metrics Sorting**: Organizes data by various engagement metrics.
- **Batch Processing**: Enables efficient data collection for multiple channels.

## Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/dlinh31/youtube-data-aggregator.git
 
## Installation
To test Vidlytics, follow these steps:


2. Install dependencies:
    ```bash
    cd youtube-data-aggregator && npm install
    ```

## Usage

1. Set up your Youtube API credentials:
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project or select an existing one.
    - Enable the Youtube Data API v3 for your project.
    - Create API credentials (OAuth 2.0 client ID) and get your personal API Key.

2. Configure the application:
    - Create an .env file, and specify the following environment variables:
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


5. Access the application:
    - Open your web browser and navigate to the local host port displayed in the terminal.
    - Use the provided interface to enter the Youtube channel IDs and select the data you want to generate.

## Contributing
Contributions are welcome! If you would like to contribute to Vidlytics, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.
