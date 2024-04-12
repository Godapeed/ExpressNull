const {getJsonResponse} = require("../fs");

h = {  

Received4: {
  path: "./models/test/derectoris/home",
  data: {
    path: "C:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/home",
    name: "home",
    isFolder: true,
    size: 0,
    created: "2023-12-08T13:21:06.725Z",
    updated: "2023-12-08T13:22:36.292Z",
    children: ["package.json"],
  },
},
Received5: {
  path: "./models/test/derectoris/products",
  data: {
    path: "C:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/products",
    name: "products",
    isFolder: true,
    size: 0,
    created: "2023-12-08T13:24:52.692Z",
    updated: "2023-12-08T13:25:41.433Z",
    children: ["category", "home.txt"],
  },
},
Received6: {
  path: "./models/test/derectoris/products/category",
  data: {
    path: "C:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/products/category",
    name: "category",
    isFolder: true,
    size: 0,
    created: "2023-12-08T13:25:41.433Z",
    updated: "2023-12-08T13:45:43.234Z",
    children: ["123", "main.txt"],
  },
},
Received7: {
  path: "./models/test/derectoris/about/about.txt",
  data: {
    path: "C:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/about/about.txt",
    name:"about.txt",
    isFolder:false,
    size:11,
    created:"2023-12-08T13:26:58.616Z",
    updated:"2023-12-08T13:27:05.651Z",
    children:[]
  }
},
Received8: {
  path: "./models/test/derectoris/contact/contact.txt",
  data: {
    path: "C:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/contact/contact.txt",
    name:"contact.txt",
    isFolder:false,
    size:84,
    created:"2023-12-08T13:27:31.427Z",
    updated:"2023-12-08T13:28:20.242Z",
    children:[]
  }
},
Received9: {
  path: "./models/test/derectoris/contact/dffdf",
  data: null,
},
Received10: {
  path: "./models/test/derectoris/contact/d.txt",
  data: null,
},
Received1: {
  path: "./models/test/derectoris/products/category/123",
  data: {
    path: "C:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/products/category/123",
    name: "123",
    isFolder: true,
    size: 0,
    created: "2024-02-12T13:48:18.004Z",
    updated: "2024-02-12T13:48:18.014Z",
    children: ["123.txt"],
  },
},

Received3: {
  path: "./models/test/derectoris/products/category/category2",
  data: null,
  Received0: {
    path: "",
    data: {
      "path": "c:/Users/Кирилл/Desktop/Стажировка/FSService/models/test/derectoris/home",
      "name":"home",
      "isFolder":true,
      "size":0,"created":
      "2024-02-12T13:48:17.582Z",
      "updated":"2024-03-01T13:07:57.931Z",
      "children":
      [
        {
          "path":"c:\\Users\\Кирилл\\Desktop\\Стажировка\\FSService\\models\\test\\derectoris\\home\\nohome",
          "name":"nohome",
          "isFolder":true,
          "size":0,
          "created":"2024-03-01T13:07:57.931Z",
          "updated":"2024-03-01T13:07:57.931Z"
        },
        {
          "path":"c:\\Users\\Кирилл\\Desktop\\Стажировка\\FSService\\models\\test\\derectoris\\home\\package.json",
          "name":"package.json",
          "isFolder":false,
          "size":293,
          "created":"2024-02-12T13:48:17.607Z",
          "updated":"2023-12-08T13:23:02.102Z"
        }
      ]}
  },
},
}

Receiveds = {
  Received2: {
    path: "./models/test/derectoris/products/category/category1",
    data: "{Error: доступ запрешен}",
  },


}

for (let i in Receiveds) {
  path = "";
  data = {};
  for (let j in Receiveds[i]) {
    if (j === "path") {
      path = Receiveds[i][j];
    } else {
      data = Receiveds[i][j];
    }
  }
  test(i, async () => {
    try {
      expect(JSON.stringify(await getJsonResponse(path))).toBe(JSON.stringify(data));
    } catch(err) {
      console.error(err);
    }
  });
}