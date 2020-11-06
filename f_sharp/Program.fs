type UnvalidatedUserId = UnvalidatedUserId of int
type UnvalidatedBookId = UnvalidatedBookId of int
type ValidUserId = ValidUserId of int
type ValidBookId = ValidBookId of int

type Borrowed = {
    ValidUserId: ValidUserId
    ValidBookId: ValidBookId
}

type BookNotCurrentlyAvailable = {
    ValidUserId: ValidUserId
    ValidBookId: ValidBookId
}

type BookNotFound = {
    BookId: UnvalidatedBookId
}

type UserNotFound = {
    BserId: UnvalidatedUserId
}

type BorrowFailure =
  | BookNotCurrentlyAvailable
  | BookNotFound
  | UserNotFound

type ValidateUserId = UnvalidatedUserId -> ValidUserId option
type ValidateBookId = UnvalidatedBookId -> ValidBookId option
type MarkBookBorrowed = ValidUserId -> ValidBookId -> Borrowed option
type BorrowBook = 
    ValidateUserId
        -> ValidateBookId 
        -> MarkBookBorrowed 
        -> UnvalidatedUserId 
        -> UnvalidatedBookId 
        -> Result<Borrowed, BorrowFailure>

open System

[<EntryPoint>]
let main argv =
    printfn "Hello World from F#!"
    0 // return an integer exit code
