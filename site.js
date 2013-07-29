function requestData() {

	var kiiAppId = $("#kii_app_id").val();
	var kiiAppKey = $("#kii_app_key").val();
	var kiiSiteId = eval( $("#kii_site_id").val() );
	var kiiBucketName = $("#kii_bucket_name").val();
	if (!kiiAppId || !kiiAppKey || !kiiSiteId || !kiiBucketName) {
		alert("Enter a valid kii app key and kii app key. " + 
			  "\nYou can find these values by logging into developer.kii.com, clicking on your app," +
			  " and clicking 'access keys' at the top");
	}
	
	// Must be initialized with your AppID, AppKey and SiteID
	// before any other Kii SDK calls are made
	Kii.initializeWithSite(kiiAppId, kiiAppKey, kiiSiteId);

	var bucket = Kii.bucketWithName(kiiBucketName);
	var all_query = KiiQuery.queryWithClause();

	var queryCallbacks = {
		success: function(queryPerformed, resultSet, nextQuery) {
			// do something with the results
			$("#num_results_found").html( resultSet.length );
			$(".data_table").show();
			$(".data_table").append( $("<div/>").html(resultSetToTable(resultSet)) );
		},
		failure: function(queryPerformed, anErrorString) {
			// do something with the error response
			alert("Kii returned an error: " + anErrorString)
		}
	}

	// Execute the query
	bucket.executeQuery(all_query, queryCallbacks);
}

function resultSetToTable(resultSet) {
	var table = '', table_header = '', table_body = '', key = '';
	var currResult;

	//build the header
	if (resultSet.length > 0) {
		for(key in resultSet[0]._customInfo) {
			table_header += "<th>" + key + "</th>";
		}
		table_header += "<th>created</th>";
		table_header += "<th>modified</th>";
		table_header = "<tr>" + table_header + "</tr>"
	}

	for(var i=0; i<resultSet.length; i++) {
		// do something with the object
		// resultSet[i]; // could be KiiObject, KiiGroup, KiiUser, etc
		currResult = resultSet[i]._customInfo;
		table_body += "<tr>";
		for (key in currResult) {
			table_body += "<td>" + JSON.stringify(currResult[key]) + "</td>";
		}
		table_body += "<td>" + new Date(resultSet[i].getCreated()) + "</td>";
		table_body += "<td>" + new Date(resultSet[i].getModified()) + "</td>";
		table_body += "</tr>";
	}

	table = "<table>" + table_header + table_body + "</table>";
	return table;
}