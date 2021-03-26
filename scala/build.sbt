ThisBuild / scalaVersion := "2.13.5"
ThisBuild / organization := "fi.bytecraft.fdm"

lazy val functionalDomainModelling = (project in file("."))
  .settings(
    name := "FunctionalDomainModelling"
  )
