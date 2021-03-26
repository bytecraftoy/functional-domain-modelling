import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "fi.bytecraft.fdm"

plugins {
    kotlin("jvm") version "1.4.32"
}
repositories {
    mavenCentral()
}

val compileKotlin: KotlinCompile by tasks
compileKotlin.kotlinOptions.apiVersion = "1.4"
compileKotlin.kotlinOptions.languageVersion = "1.4"
