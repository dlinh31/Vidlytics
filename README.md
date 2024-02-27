# Vidlytics: YouTube Data Aggregator

## Web App
You can access the Vidlytics web app at [https://vidlytics.netlify.app/](https://vidlytics.netlify.app/).
The first load will take a bit more time due to limitation of back-end deployment through Render. 

## Description
**Vidlytics** is a web application leveraging React.js, Node.js and Youtube Data API to aggregate YouTube channel data. It streamlines the collection of video details, view counts, and other metrics, supporting batch processing for multiple channels simultaneously.

## Features
- **Data Aggregation**: Collects data across multiple YouTube channels.
- **Detailed Analytics**: Retrieves titles, descriptions, views, and more.
- **Metrics Sorting**: Organizes data by various engagement metrics.
- **Batch Processing**: Enables efficient data collection for multiple channels.


## Usage (Locally)
1. Clone the repo:
    ```bash
    git clone https://github.com/dlinh31/youtube-data-aggregator.git
    ```


2. Set up your Youtube API credentials:
     - Go to the [Google Cloud Console](https://console.cloud.google.com/).
     - Create a new project or select an existing one.
     - Enable the Youtube Data API v3 for your project.
     - Create API credentials (OAuth 2.0 client ID) and get your personal API Key.

3. Configure the application:
     - Create an .env file, and specify the following environment variables:
          - `YOUTUBE_API_KEY`: Your personal API Key from Youtube API v3



4. Run the application (Front-end):
     ```bash
     cd client
     npm install
     npm run dev
     ```

5. Run the application on a separate terminal (Back-end):
     ```bash
     cd server
     npm install
     node server.js
     ```

6. Access the application:
     - Open your web browser and navigate to the local host port displayed in the terminal.
     - Use the provided interface to enter the Youtube channel IDs and select the data you want to generate.


## API documentation
API Endpoint: <code>https://vidlytics.onrender.com/api/</code>

#### Get Youtube channel information

<details>
 <summary><code>GET</code><code><b>/channel/{channelHandle}</b></code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | channelHandle |  required | string               |  username/handle of a youtube channel (after @ of channel link)   |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`                | Channel ID, viewCount, subscriberCount and videoCount             |
> | `400`         | `application/json`                | `{"error": "Channel not found"}`                                    |

#### Get all videos from a playlist
</details>

------------------------------------------------------------------------------------------
<details>
 <summary><code>GET</code><code><b>/playlist/{playlistId}</b></code> </summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | playlistId|  required | string                  | ID of the playlist                                                    |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`                | Information of all videos from given playlist                       |
> | `400`         | `application/json`                | `{"error": "No videos is found for the specified channel"}`         |

</details>

------------------------------------------------------------------------------------------


## Contributing
Contributions are welcome! If you would like to contribute to Vidlytics, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.

