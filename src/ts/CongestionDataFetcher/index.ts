import * as $ from 'jquery';

export declare interface congestionData{
    
    atrium: number[];
    lounge: number[];
    syokudo: number[];

}

export class CongestionDataFetcher {
	
	private data: congestionData;

	public onDataFetch: Function;

	constructor() {
		
		this.data = {
			atrium: [],
			lounge: [],
			syokudo: []
		}		

		this.fetchData();

		setInterval(()=>{
			this.fetchData.bind(this);
		},5000)
		
	}

	fetchData(){

		$.post({
			
			url: 'php/fetch_data.php',
			
			dataType: 'json', 

		}).done((data) => {
			
			this.data.atrium = data.atrium;
			this.data.lounge = data.lounge;
			this.data.syokudo = data.syokudo;

			if( this.onDataFetch ){

				this.onDataFetch( data );
			
			}
			
		})

	}
}