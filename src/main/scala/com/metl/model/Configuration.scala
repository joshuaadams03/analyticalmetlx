package com.metl.model

import net.liftweb.http._
import net.liftweb.http.SHtml._
import net.liftweb.common._
import S._
import net.liftweb.util._
import Helpers._
import scala.xml._
import scala.collection.mutable.{Map=>MutableMap}

case class ClientConfiguration(xmppHost:String,xmppPort:Int,xmppDomain:String,xmppUsername:String,xmppPassword:String,conversationSearchUrl:String,webAuthenticationUrl:String,thumbnailUrl:String,resourceUrl:String,historyUrl:String,httpUsername:String,httpPassword:String,structureDirectory:String,resourceDirectory:String,uploadPath:String,primaryKeyGenerator:String,cryptoKey:String,cryptoIV:String,imageUrl:String)

abstract class ConfigurationProvider {
  val keys:MutableMap[String,String] = MutableMap.empty[String,String]
  def checkPassword(username:String,password:String):Boolean = {
    println("checking: %s %s in %s".format(username,password,keys))
    keys.get(username).exists(_ == password)
  }
  def getPasswords(username:String):Option[Tuple4[String,String,String,String]] = {
    val xu = adornUsernameForEjabberd(username)
    val hu = adornUsernameForYaws(username)

    val xp = keys.get(xu) match {
      case None => {
        val np = generatePasswordForEjabberd(xu)
        keys.update(xu,np)
        Some(np)
      }
      case some => some
    }
    val hp = keys.get(hu) match {
      case None => {
        val np = generatePasswordForYaws(hu)
        keys.update(hu,np)
        Some(np)
      }
      case some => some
    }
    for (
      x <- xp;
      h <- hp
    ) yield {
      (xu,x,hu,h)
    }
  }
  protected def generatePasswordForYaws(username:String):String 
  protected def generatePasswordForEjabberd(username:String):String 
  def adornUsernameForEjabberd(username:String):String 
  def adornUsernameForYaws(username:String):String 
  def vendClientConfiguration(username:String):Option[ClientConfiguration] = {
    for (
      cc <- MeTLXConfiguration.clientConfig;
      (xu,xp,hu,hp) <- getPasswords(username)
    ) yield {
      cc.copy(
        xmppUsername = xu,
        xmppPassword = xp,
        httpUsername = hu,
        httpPassword = hp
      )
    }
  }
}
class StableKeyConfigurationProvider(scheme:String,localPort:Int,remoteBackendHost:String,remoteBackendPort:Int) extends ConfigurationProvider {
  protected val ejPassword = nextFuncName
  protected val verifyPath:String = "verifyUserCredentials"
  protected val returnAddress:String = {
    "%s:%s".format(getLocalIp,getLocalPort)    
  }
  protected val getLocalIp:String = {
    val socket = new java.net.Socket(remoteBackendHost,remoteBackendPort)
    val ip = socket.getLocalAddress.toString match {
      case s if s.startsWith("/") => s.drop(1)
      case s => s
    }
    socket.close()
    ip
  }
  protected val getLocalPort:String = {
    localPort.toString
  }
  override def checkPassword(username:String,password:String):Boolean = {
    if (username.startsWith("ejUserAndIp_"))
      password == ejPassword
    else 
      super.checkPassword(username,password)
  }
  protected def generatePasswordForEjabberd(username:String):String = nextFuncName
  protected def generatePasswordForYaws(username:String):String = nextFuncName
  def adornUsernameForEjabberd(username:String):String = "ejUserAndIp|%s|%s".format(username,scheme,getLocalIp,getLocalPort,verifyPath)
  def adornUsernameForYaws(username:String):String = "%s@%s".format(username,returnAddress)
}

class StaticKeyConfigurationProvider(ejabberdUsername:Option[String],ejabberdPassword:String,yawsUsername:Option[String],yawsPassword:String) extends ConfigurationProvider {
  ejabberdUsername.foreach(eu => {
    keys.update(eu,ejabberdPassword)
  })
  yawsUsername.foreach(yu => {
    keys.update(yu,yawsPassword)
  })
  override def checkPassword(username:String,password:String):Boolean = {
    println("checking: %s %s in %s".format(username,password,keys))
    ejabberdUsername.filter(_ == username).map(_u => password == ejabberdPassword).getOrElse(false) || 
    yawsUsername.filter(_ == username).map(_u => password == yawsPassword).getOrElse(false) ||
    keys.get(username).exists(_ == password)
  }
  protected def generatePasswordForEjabberd(username:String):String = ejabberdPassword
  protected def generatePasswordForYaws(username:String):String = yawsPassword
  def adornUsernameForEjabberd(username:String):String = ejabberdUsername.getOrElse(username)
  def adornUsernameForYaws(username:String):String = yawsUsername.getOrElse(username)
}