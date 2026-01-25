export default function DpaPage() {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Data Processing Addendum</h1>
            <p className="text-sm text-muted-foreground mb-12">Last Updated: January 2026</p>

            <div className="prose prose-invert max-w-none text-muted-foreground">
                <p>
                    This Data Processing Addendum ("DPA") forms part of the Terms of Service
                    between ShipDocket and you ("Customer").
                </p>

                <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">1. Definitions</h3>
                <p>
                    "Personal Data", "Process", "Controller", and "Processor" shall have the
                    meanings given to them in the GDPR.
                </p>

                <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">
                    2. Processing of Personal Data
                </h3>
                <p>
                    ShipDocket shall process Personal Data only on behalf of and in accordance
                    with your instructions. We act as a Processor for the metadata you provide.
                </p>

                <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">
                    3. Security Measures
                </h3>
                <p>
                    We implement appropriate technical and organizational measures to protect
                    Personal Data, including encryption and access controls.
                </p>

                <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">
                    4. Sub-processors
                </h3>
                <p>
                    You authorize us to engage sub-processors (e.g., Supabase, Render) to
                    provide the Service. We remain liable for their acts and omissions.
                </p>
            </div>
        </div>
    );
}
