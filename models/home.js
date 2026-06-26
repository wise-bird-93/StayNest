const db = require("../utils/dataBaseUtil");

module.exports = class Home {

    constructor(houseName, description, price, location, rating, photoURL) {
        this.id = Date.now().toString();
        this.houseName = houseName;
        this.description = description;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoURL = photoURL;
    }

    save() {
        return db.execute(
            "INSERT INTO homes(id, houseName, description, price, location, rating, photoURL) VALUES(?,?,?,?,?,?,?)",[
                this.id, this.houseName, this.description, this.price, this.location, this.rating, this.photoURL
            ]
        )
    }

    static fetchAll() {
        return db.execute('SELECT * FROM homes');
    }

    static findById(homeId){
        return db.execute("SELECT * FROM homes WHERE id=?",[homeId]);
    }

    static delete(homeId) {
        return db.execute("DELETE FROM homes WHERE id=?",[homeId]);
    }  

    static update(homeId, houseName, description, price, location, rating, photoURL){
        return db.execute(
            `UPDATE homes
            SET houseName=?, description=?, price=?, location=?, rating=?, photoURL=?
            WHERE id=?`,
            [houseName, description, price, location, rating, photoURL, homeId]
        );
    }
}