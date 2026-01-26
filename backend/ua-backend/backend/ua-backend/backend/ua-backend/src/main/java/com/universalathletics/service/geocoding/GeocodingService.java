package com.universalathletics.service.geocoding;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.universalathletics.modules.coach.entity.CoachEntity;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeocodingService {
    /**
     * Instance of RestTemplate for making HTTP requests to OpenStreetMap API.
     */
    private static final RestTemplate restTemplate = new RestTemplate();

    /**
     * Helper method to parse latitude from coordinate string
     * @param coordinateString String in format "Latitude: 42.02384529218001, Longitude: -93.64541386213286"
     * @return double the parsed latitude value
     */
    public double parseLatitude(String coordinateString) {
        if (coordinateString == null || coordinateString.isEmpty()) {
            return 0.0;
        }
        
        try {
            // Extract the substring between "Latitude: " and the comma
            int startIndex = coordinateString.indexOf("Latitude: ") + "Latitude: ".length();
            int endIndex = coordinateString.indexOf(",", startIndex);
            
            if (startIndex < 0 || endIndex < 0) {
                System.err.println("Invalid coordinate string format for latitude: " + coordinateString);
                return 0.0;
            }
            
            String latitudeStr = coordinateString.substring(startIndex, endIndex).trim();
            double latitude = Double.parseDouble(latitudeStr);
            System.out.println("Parsed latitude: " + latitude);
            System.out.println("Rounded Latitude: " + Math.round(latitude * 100000.0) / 100000.0);
            
            // Round the latitude to 5 decimal places
            return Math.round(latitude * 100000.0) / 100000.0;
        } catch (Exception e) {
            System.err.println("Error parsing latitude from: " + coordinateString);
            e.printStackTrace();
            return 0.0;
        }
    }
   
    /**
     * Helper method to parse longitude from coordinate string
     * @param coordinateString String in format "Latitude: 42.02384529218001, Longitude: -93.64541386213286"
     * @return double the parsed longitude value
     */
    public double parseLongitude(String coordinateString) {
        if (coordinateString == null || coordinateString.isEmpty()) {
            return 0.0;
        }
        
        try {
            // Extract the substring after "Longitude: "
            int startIndex = coordinateString.indexOf("Longitude: ") + "Longitude: ".length();
            
            if (startIndex < 0) {
                System.err.println("Invalid coordinate string format for longitude: " + coordinateString);
                return 0.0;
            }
            
            String longitudeStr = coordinateString.substring(startIndex).trim();
            double longitude = Double.parseDouble(longitudeStr);
           
            // Round the longitude to 5 decimal places
            return Math.round(longitude * 100000.0) / 100000.0;
        } catch (Exception e) {
            System.err.println("Error parsing longitude from: " + coordinateString);
            e.printStackTrace();
            return 0.0;
        }
    }

    /**
     * Helper method to convert the latitude and longitude to a city/state string using OpenStreetMap Nominatim API
     */
    public String getCityStateFromCoordinates(double latitude, double longitude) {
        try {
            // Format the URL for the Nominatim API
            String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f&zoom=10",
                latitude, longitude
            );

            System.out.println("URL for openstreet API: " + url);
            
            // Set required headers - User-Agent is required by Nominatim's usage policy
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "UniversalAthleticsApp");
            
            // Make the request
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), Map.class
            );
            
            // Process the response
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("address")) {
                @SuppressWarnings("unchecked")
                Map<String, String> address = (Map<String, String>) body.get("address");
                
                // Extract relevant location information
                String city = address.getOrDefault("city", 
                             address.getOrDefault("town",
                             address.getOrDefault("village", "Unknown")));
                             
                String state = address.getOrDefault("state", 
                              address.getOrDefault("county", ""));
                                
                // Format the location string
                if (!state.isEmpty()) {
                    return String.format("%s, %s", city, state);
                } else {
                    return city;
                }
            }
            
            return "Location not found";
        } catch (Exception e) {
            System.err.println("Error getting location from coordinates: " + e.getMessage());
            e.printStackTrace();
            return "Error retrieving location";
        }

    }    
   
    /**
     * Helper method to calculate distance between two sets of coordinates using the Haversine formula
     * @param lat1
     * @param lon1
     * @param lat2
     * @param lon2
     * @return double the distance in kilometers
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; 
    }

    /**
     * Helper method to update each coaches location to a readable format (city, state, country)
     * @param coaches - existing list of coaches with locations in coordinate format
     * @return List<CoachEntity> - updated list of coaches with readable locations
     **/
     public List<CoachEntity> updateCoachLocations(List<CoachEntity> coaches) {
        String formattedLocation; 
        double latitude;
        double longitude;
        List<CoachEntity> updatedCoaches = new ArrayList<>();
        CoachEntity currentCoach;
    
        for (CoachEntity coach : coaches) {
            latitude = parseLatitude(coach.getLocation());
            longitude = parseLongitude(coach.getLocation());
            formattedLocation = getCityStateFromCoordinates(latitude, longitude);
            currentCoach = new CoachEntity(coach.getFirstName(), coach.getLastName(), coach.getEmail(), coach.getPhone(), coach.getBiography1(), coach.getBiography2(), coach.getProfilePic(), coach.getBioPic1(), coach.getBioPic2(), formattedLocation, coach.getFirebaseID());
            updatedCoaches.add(currentCoach);
        }

        return updatedCoaches;
    }
}
