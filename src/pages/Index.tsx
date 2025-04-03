
import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import InvestorCard from '@/components/InvestorCard';
import InvestorForm from '@/components/InvestorForm';
import { searchInvestors, getInvestorByPan, addInvestor } from '@/services/investorService';
import { InvestorDetails } from '@/types/investor';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const Index = () => {
  const [searchResults, setSearchResults] = useState<InvestorDetails[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a name, mobile number, or folio number to search.",
        variant: "destructive",
      });
      return;
    }

    const results = searchInvestors(query);
    setSearchResults(results);
    setSelectedInvestor(null);
    setHasSearched(true);

    if (results.length === 0) {
      toast({
        title: "No results found",
        description: "No investors match your search criteria.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Search results",
        description: `Found ${results.length} investor${results.length > 1 ? 's' : ''}.`,
      });
    }
  };

  const handleViewDetails = (pan: string) => {
    const investor = getInvestorByPan(pan);
    if (investor) {
      setSelectedInvestor(investor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveInvestor = (investor: InvestorDetails) => {
    addInvestor(investor);
    setFormOpen(false);
    toast({
      title: "Success",
      description: `Investor ${investor.name} has been added successfully.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-finance mb-4 md:mb-0">Investor Search</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <Button 
                className="bg-finance hover:bg-finance-dark" 
                onClick={() => setFormOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Add Investor
              </Button>
            </div>
          </div>

          {/* Results area */}
          <div className="space-y-8">
            {/* Selected investor details */}
            {selectedInvestor && (
              <section>
                <h3 className="text-xl font-semibold text-finance mb-4">Investor Details</h3>
                <InvestorCard investor={selectedInvestor} />
              </section>
            )}

            {/* Search results */}
            {hasSearched && (
              <section>
                <h3 className="text-xl font-semibold text-finance mb-4">Search Results</h3>
                {searchResults.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <SearchResults 
                      results={searchResults} 
                      onViewDetails={handleViewDetails} 
                    />
                  </div>
                ) : (
                  <Card className="p-8 text-center text-gray-500">
                    No investors found matching your search criteria.
                  </Card>
                )}
              </section>
            )}

            {/* Initial state when no search yet */}
            {!hasSearched && (
              <div className="text-center p-12 bg-finance-highlight rounded-lg border border-finance-light">
                <h3 className="text-xl font-semibold text-finance mb-2">Find Investors</h3>
                <p className="text-gray-600 mb-4">
                  Search by investor name, mobile number or folio number to view their complete details.
                </p>
                <div className="text-sm text-gray-500">
                  You'll be able to view personal details, nominee information, bank accounts, and investment schemes.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Investor form */}
      <InvestorForm 
        onSave={handleSaveInvestor}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <footer className="bg-finance-dark text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; 2025 Folio Finder Elite. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
