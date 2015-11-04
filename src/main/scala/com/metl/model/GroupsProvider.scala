package com.metl.model

import com.metl.data._
import com.metl.utils._
import com.metl.view._

import net.liftweb.http.SessionVar
import net.liftweb.http.LiftRules
import net.liftweb.common._
import net.liftweb.util.Helpers._

import net.liftweb.util.Props
import scala.io.Source
import scala.xml.{Source=>XmlSource,_}

object GroupsProvider {
  def createFlatFileGroups(in:NodeSeq):GroupsProvider = {
    (in \\ "@format").text match {
      case "stLeo" => new StLeoFlatFileGroupsProvider((in \\ "@location").text,(in \\ "@refreshPeriod").text)
      case "globalOverrides" => new GlobalOverridesGroupsProvider((in \\ "@location").text,(in \\ "@refreshPeriod").text)
      case "specificOverrides" => new SpecificOverridesGroupsProvider((in \\ "@location").text,(in \\ "@refreshPeriod").text)
      case _ => throw new Exception("unrecognized flatfile format")
    }
  }
}

trait GroupsProvider {
  def getGroupsFor(username:String):List[Tuple2[String,String]] = {
    Nil
  }
}

class SelfGroupsProvider extends GroupsProvider {
  override def getGroupsFor(username:String) = List(("ou",username))
}

abstract class RefreshingFlatFileGroupsProvider(path:String,refreshPeriod:String) extends FileWatchingComprehender[Map[String,List[Tuple2[String,String]]]](path,refreshPeriod) with GroupsProvider {
  override def startingValue = Map.empty[String,List[Tuple2[String,String]]]
  override def getGroupsFor(username:String) = {
    lastCache.get(username).getOrElse(Nil)    
  }
}

abstract class FileWatchingComprehender[T](path:String,refreshPeriod:String) { 
  protected val timespan = 5 minutes
  protected var lastModified:Long = 0
  protected def startingValue:T
  protected var lastCache:T = startingValue
  protected var cache = new PeriodicallyRefreshingVar[Unit](timespan,() => {
    val newCheck = new java.io.File(path).lastModified()
    if (newCheck > lastModified){
      println("file modification detected: %s".format(path))
      lastCache = comprehendFile
      lastModified = newCheck
    }
  })
  protected def comprehendFile:T
}

class GlobalOverridesGroupsProvider(path:String,refreshPeriod:String) extends FileWatchingComprehender[List[Tuple2[String,String]]](path,refreshPeriod) with GroupsProvider {
  println("created new globalGroupsProvider(%s,%s)".format(path,refreshPeriod))
  override def getGroupsFor(username:String) = lastCache
  override protected def startingValue = Nil
  override protected def comprehendFile:List[Tuple2[String,String]] = {
    var rawData = List.empty[Tuple2[String,String]]
    Source.fromFile(path).getLines.foreach(line => {
      line.split("\t") match {
        case Array(groupType,groupKey) => {
          rawData = (List((groupType,groupKey)) ::: rawData).distinct
        }
        case _ => {}
      }
    })
    println("loaded groupData for %s: %s".format(path,rawData))
    rawData
  }
}

class SpecificOverridesGroupsProvider(path:String,refreshPeriod:String) extends RefreshingFlatFileGroupsProvider(path,refreshPeriod) {
  println("created new specificGroupsProvider(%s,%s)".format(path,refreshPeriod))
  override def comprehendFile:Map[String,List[Tuple2[String,String]]] = {
    var rawData = Map.empty[String,List[Tuple2[String,String]]]
    Source.fromFile(path).getLines.foreach(line => {
      line.split("\t") match {
        case Array(username,groupType,groupKey) => {
          rawData = rawData.updated(username,(List((groupType,groupKey)) ::: rawData.get(username).toList.flatten).distinct)
        }
        case _ => {}
      }
    })
    println("loaded groupData for %s: %s".format(path,rawData))
    rawData
  }
}

class StLeoFlatFileGroupsProvider(path:String,refreshPeriod:String) extends RefreshingFlatFileGroupsProvider(path,refreshPeriod) {
  override def comprehendFile:Map[String,List[Tuple2[String,String]]] = {
    var rawData = Map.empty[String,List[Tuple2[String,String]]]
    Source.fromFile(path).getLines.foreach(line => {
      line.split("\t") match {
        case Array(facId,_facFirstName,_facSurname,facUsername,course,section,studentId,studentFirstName,studentSurname,studentUsername,studentStatus) => {
          studentStatus match {
            case "ACTIVE" => {
              rawData = rawData.updated(studentUsername,(List(("ou",section),("ou",course)) ::: rawData.get(studentUsername).toList.flatten).distinct)
            }
            case _ =>  {}
          }
          rawData = rawData.updated(facUsername,(List(("ou",section),("ou",course)) ::: rawData.get(facUsername).toList.flatten).distinct)
        }
        case _ => {}
      }
    })
    println("loaded groupData for %s: %s".format(path,rawData))
    rawData
  }
}