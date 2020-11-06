ThisBuild / scalaVersion := "2.13.3"
ThisBuild / organization := "fi.bytecraft.fdm"

lazy val functionalDomainModelling = (project in file("."))
  .settings(
    name := "FunctionalDomainModelling"
  )
