/**
 * Code from a blog that gets the list of Team Drives 
 * this app can see at this moment in time as this user!  
 * Permissions Minefield.
 * https://security.google.com/settings/security/permissions
 * Make sure "pageSize" > number of teamdrives otherwise will timeout.
 */
function getGoogleTeamDrives() { 
  Logger.log("INFO: getGoogleTeamDrives: enter");

  try {
    
    var teamDrives = {},
        baseUrl = "https://www.googleapis.com/drive/v3/teamdrives",
        token = ScriptApp.getOAuthToken(),
        params = {
          pageSize: 20,
          fields: "nextPageToken,teamDrives(id,name)"
        }; 
    do {
      
      // Written by Amit Agarwal @labnol
      // Web: www.ctrlq.org

      var queryString = Object.keys(params).map(function(p) {
        return [encodeURIComponent(p), encodeURIComponent(params[p])].join("=");
      }).join("&amp;");
      
      var apiUrl = baseUrl + "?" + queryString;
      
      var response = JSON.parse(
        UrlFetchApp.fetch( apiUrl, {
          method: "GET",
          headers: {"Authorization": "Bearer " + token}
        }).getContentText());
      
      response.teamDrives.forEach(function(teamDrive) {
        Logger.log("INFO: Team Drive: "+teamDrive.name + " (" + teamDrive.id + ")");

        teamDrives[teamDrive.name] = teamDrive.id;
      })
      
      params.pageToken = response.nextPageToken;
      
    } while (params.pageToken);
    
    return teamDrives;
    
  } catch (f) {
    
    Logger.log(f.toString());
    
  }
  
  return false;
  
}
