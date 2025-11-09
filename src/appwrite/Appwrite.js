import { Client, Account, Databases, Storage, ID } from "appwrite";
import Conf from "../conf/Conf";

class Appwrites {
  client = new Client();
  account;
  databases;
  storage;

  constructor() {
    this.client.setEndpoint(Conf.appwriteurl).setProject(Conf.projectid);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    
  }


  async register({ fullname, email, password }) {
    try {
      return await this.account.create(ID.unique(), email, password, fullname);
    } catch (error) {
      throw error;
    }
  }

 async login({ email, password }) {
  try {
    const session = await this.account.createEmailPasswordSession(email, password);
    return session; // just return session, skip account.get()
  } catch (error) {
    throw error;
  }
}


  async currentuser() {
    try {
      return await this.account.get();
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      throw error;
    }
  }

    async getfile(file){
        try {
            return await this.storage.createFile(
                Conf.bucketid,
                ID.unique(),
                file
            )
        } catch (error) {
            throw error;
        }
    }

    async showfile(fileID){
        try {
            return await this.storage.getFile(
                Conf.bucketid,
                fileID
               
            )
        } catch (error) {
            throw error;
        }
    }

      async getuserdata({ username,imageurl }) {
  try {
    const user = await this.account.get();

    return await this.databases.createDocument(
      Conf.databaseid,
      Conf.datacollectionid,
      ID.unique(),
      {
        imageurl,
        username,    
        useris: user.$id,
      }
    );
  } catch (error) {
    throw error;
  }
}




       async showuserdata(){
        try {
            return await this.databases.listDocuments(
                Conf.databaseid,
                Conf. datacollectionid,
            )

        } catch (error) {
            throw error;
        }
       }

       async textdata({reciverid,text}){
        try {
           const users = await this.account.get();

          return await this.databases.createDocument(
            Conf.databaseid,
            Conf.textcollectionid,
            ID.unique(),
            {
              senderid : users.$id,
              reciverid,
              text,
              timespan: new Date().toISOString(),
            }
          )
        } catch (error) {
            throw error;
        }
       }



        async showtextdata(){
          try {
              return await this.databases.listDocuments(
                  Conf.databaseid,
                  Conf.textcollectionid,
              )
  
          } catch (error) {
              throw error;
          }
         }
  }

  const Appwrite=new Appwrites();
  export default Appwrite;
   