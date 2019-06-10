import * as $ from 'jquery';

export class CongestionData {

	public atrium: number[];
	public rounge: number[];
	public syokudo: number[];

	constructor() {
		
		this.fetchData();

		setInterval(()=>{
			this.fetchData();
		},5000)
		
	}

	

	fetchData(){

		$.post({
			
			url: 'php/fetch_data.php',
			
			dataType: 'json', 

		}).done(function(data){
			
			console.log(data);
			
		}).fail(function(XMLHttpRequest, textStatus, errorThrown){

			// alert(errorThrown);
		
		})

	}
}