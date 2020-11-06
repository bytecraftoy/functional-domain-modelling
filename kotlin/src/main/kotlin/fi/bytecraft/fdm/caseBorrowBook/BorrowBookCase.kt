package fi.bytecraft.fdm.caseBorrowBook

sealed class Result<out T, out E>
data class Success<T, E>(val success: T) : Result<T, E>()
data class Failure<T, E>(val error: E) : Result<T, E>()

data class UnvalidatedUserId(val id: Int)
data class UnvalidatedBookId(val id: Int)
data class ValidUserId(val id: Int)
data class ValidBookId(val id: Int)

data class Borrowed(val validUserId: ValidUserId, val validBookId: ValidBookId)

sealed class BorrowFailure
data class BookNotCurrentlyAvailable(
        val validUserId: ValidUserId, val validBookId: ValidBookId): BorrowFailure()
data class BookNotFound(val bookId: UnvalidatedBookId): BorrowFailure()
data class UserNotFound(val userId: UnvalidatedUserId): BorrowFailure()

typealias ValidateUserId = (UnvalidatedUserId) -> ValidUserId?
typealias ValidateBookId = (UnvalidatedBookId) -> ValidBookId?
typealias MarkBookBorrowed = (ValidUserId, ValidBookId) -> Borrowed?

typealias BorrowBook =
        (ValidateUserId, ValidateBookId, MarkBookBorrowed) ->   // dependencies
        (UnvalidatedUserId, UnvalidatedBookId) -> Result<Borrowed, BorrowFailure>

val borrowBook: BorrowBook = { validateUserId, validateBookId, markBookBorrowed ->
    { unvalidatedUserId, unvalidatedBookId ->
        val validUserId = validateUserId(unvalidatedUserId)
        val validBookId = validateBookId(unvalidatedBookId)
        if (validUserId == null) {
            Failure(UserNotFound(unvalidatedUserId))
        } else if (validBookId == null){
            Failure(BookNotFound(unvalidatedBookId))
        } else {
            val borrow = markBookBorrowed(validUserId, validBookId)
            if (borrow == null) {
                Failure(BookNotCurrentlyAvailable(validUserId, validBookId))
            } else {
                Success(borrow)
            }
        }
    }
}