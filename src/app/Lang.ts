export class Lang {
    langauge: string = "en";
    texts: Object = {
        "en": {
            "หมากฮอส": "Checkers",
            "ตาที่": "Turn #",
            "ผู้เล่น": "Player",
            "อัศวิน": "Knight",
            "คิง": "King",
            "ตัว": "Pieces",

        }
    }

    constructor() {
        
    }

    txt(key: string) {
        if (this.texts[this.langauge][key]) {
            return this.texts[this.langauge][key];
        }

        return key;
    }
}