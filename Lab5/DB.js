let event = require("events");
const url = require("url");
class DB extends event.EventEmitter{
	constructor(){
		super();
		this.db_data =
		[
		{id: 1, name: "Иванов И.И.",  bday: "2001-01-03"},
		{id: 2, name: "Сидоров С.С.", bday: "2001-01-04"},
		{id: 3, name: "Петров П.П.",  bday: "2001-01-05"}
		];
	}
	async select(){
		return await new Promise((resolve, reject) =>{
			resolve(this.db_data);
		});
	}
	async insert(obj){
		return await new Promise((resolve, reject) =>{
			this.db_data.push(obj);
			resolve("Successful insert");
		});
	}
	async update(obj){
		return await new Promise((resolve, reject) =>{
			for(let data of this.db_data){
				if(data.id == obj.id){
					data.name = obj.name;
					data.bday = obj.bday;
					resolve({status: "Success"});
				}
			}
			resolve({status: "Failure"});
		});
	}
	async delete(id){
		return await new Promise((resolve, reject) =>{
			this.db_data.forEach((value, index) =>{
				if(value.id == id){
					this.db_data.splice(index, 1);
					resolve(JSON.parse(JSON.stringify(value)));
				}
			});
			resolve({status: "Failure"});
		});
	}
	async commit(){
		return await new Promise((resolve, reject) => {
			resolve("Database commited");
		});
	}
}
const db = new DB();

db.on('GET', (request, response) => {
	db.select().then((data) =>{
		console.log("GET");
		response.end(JSON.stringify(data));
	});
});

db.on('POST', (request, response) =>{
	request.on("data", (data) =>{
		const obj = JSON.parse(data);
		db.insert(obj).then((result)=>{
			console.log("POST", result);
			response.end(JSON.stringify(obj));
		});
	});
});

db.on('PUT', (request, response)=>{
	request.on("data", (data)=>{
		const obj = JSON.parse(data);
		db.update(obj).then((result)=>{
			console.log("PUT", result);
			response.end(JSON.stringify(result));
		});
	});
});

db.on('DELETE', (request, response) =>{
	request.on("data", (data) =>{
		const id = url.parse(request.url, true).query.id;
		if(id != "undefined")
			db.delete(id).then((result)=>{
				console.log("DELETE", result);
				response.end(JSON.stringify(result));
			});
	});
});
db.on('COMMIT', ()=>{
	db.commit().then((data) =>{
		console.log(data);
	});
})
exports.db = db;