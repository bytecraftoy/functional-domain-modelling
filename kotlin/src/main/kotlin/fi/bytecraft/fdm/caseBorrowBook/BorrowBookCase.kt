package fi.bytecraft.fdm.caseBorrowBook

data class UnvalidatedUserId(val id: Int)
data class UnvalidatedBookId(val id: Int)

data class ValidUserId(val id: Int)
data class ValidBookId(val id: Int)

data class BorrowBook(
    val unvalidatedBookId: UnvalidatedBookId,
    val unvalidatedUserId: UnvalidatedUserId
)

sealed class Borrowed
data class BookBorrowed(val validUserId: ValidUserId,
                        val validBookId: ValidBookId) : Borrowed()

data class BookNotFound(val bookId: UnvalidatedBookId) : Borrowed()
data class UserNotFound(val userId: UnvalidatedUserId) : Borrowed()
data class BookNotCurrentlyAvailable(val validUserId: ValidUserId,
                                     val validBookId: ValidBookId) : Borrowed()

typealias ValidateUserId = (UnvalidatedUserId) -> ValidUserId?
typealias ValidateBookId = (UnvalidatedBookId) -> ValidBookId?

typealias MarkBookBorrowed = (ValidUserId, ValidBookId) -> BookBorrowed?

typealias BorrowBookFlow =
            (ValidateUserId, ValidateBookId, MarkBookBorrowed) -> // dependencies
            (BorrowBook) -> Borrowed

val borrowBookFlow: BorrowBookFlow =
    { validateUserId, validateBookId, markBookBorrowed ->
        { borrowBook ->
            val validUserId = validateUserId(borrowBook.unvalidatedUserId)
            val validBookId = validateBookId(borrowBook.unvalidatedBookId)
            when {
                validUserId == null -> UserNotFound(borrowBook.unvalidatedUserId)
                validBookId == null -> BookNotFound(borrowBook.unvalidatedBookId)
                else ->
                    markBookBorrowed(validUserId, validBookId)
                        ?: BookNotCurrentlyAvailable(validUserId, validBookId)
            }
        }
    }
