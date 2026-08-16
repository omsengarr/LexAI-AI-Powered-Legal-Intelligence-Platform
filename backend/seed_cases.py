from database import SessionLocal
from models import Case


# ========================================
# Seed Sample Cases
# ========================================

def seed_cases():

    db = SessionLocal()

    try:

        # Check whether cases already exist
        existing_cases = db.query(Case).count()

        if existing_cases > 0:

            print(
                f"Cases already exist: {existing_cases}"
            )

            return


        # ========================================
        # Case 1
        # ========================================

        case1 = Case(
            case_number="LEX-2026-001",
            title="ABC Technologies vs XYZ Solutions",
            court="Delhi High Court",
            case_type="Intellectual Property",
            description=(
                "Legal dispute concerning intellectual "
                "property and unauthorized use of "
                "proprietary technology."
            ),
            status="Active"
        )


        # ========================================
        # Case 2
        # ========================================

        case2 = Case(
            case_number="LEX-2026-002",
            title="Raj Enterprises vs National Corporation",
            court="Bombay High Court",
            case_type="Contract Dispute",
            description=(
                "Commercial dispute involving breach "
                "of contractual obligations and payment "
                "terms."
            ),
            status="Active"
        )


        # ========================================
        # Case 3
        # ========================================

        case3 = Case(
            case_number="LEX-2026-003",
            title="Global Industries vs State Authority",
            court="Supreme Court of India",
            case_type="Regulatory",
            description=(
                "Dispute concerning regulatory compliance "
                "and government licensing requirements."
            ),
            status="Pending"
        )


        # ========================================
        # Case 4
        # ========================================

        case4 = Case(
            case_number="LEX-2026-004",
            title="Mehta Industries vs Orion Legal Services",
            court="Karnataka High Court",
            case_type="Corporate Law",
            description=(
                "Corporate dispute involving business "
                "operations, shareholder interests and "
                "corporate governance."
            ),
            status="Active"
        )


        # ========================================
        # Case 5
        # ========================================

        case5 = Case(
            case_number="LEX-2026-005",
            title="Digital Systems vs Secure Networks",
            court="Madras High Court",
            case_type="Technology Law",
            description=(
                "Technology-related dispute involving "
                "software licensing, data protection and "
                "service agreements."
            ),
            status="Closed"
        )


        # ========================================
        # Add Cases
        # ========================================

        db.add_all([
            case1,
            case2,
            case3,
            case4,
            case5
        ])


        # ========================================
        # Save to Database
        # ========================================

        db.commit()


        print(
            "5 sample cases inserted successfully."
        )


    except Exception as error:

        db.rollback()

        print(
            "Error while seeding cases:",
            error
        )


    finally:

        db.close()


# ========================================
# Run Seeder
# ========================================

if __name__ == "__main__":

    seed_cases()
